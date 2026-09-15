'use strict';

/**
 * Vision provider (Option B) - image-based product identification.
 *
 * A pluggable seam so the image-upload feature works end-to-end NOW with a
 * deterministic mock, and a real vision model (Anthropic / OpenAI / Bedrock, or
 * an OpenClaw seam) can be dropped in later by implementing one adapter.
 *
 * Interface:
 *   identifyImage(buffer, mime, hint) -> Promise<null | {
 *     category, label, confidence, provider
 *   }>
 *
 * Selected by VISION_PROVIDER env: "mock" (default) | "anthropic" | "openai" |
 * "bedrock". Unimplemented real adapters throw a clear "not configured" error
 * which is caught and turned into a safe null (caller then asks the customer to
 * describe the item or routes to a rep) - never a wrong guess.
 */

const SUPPORTED_MIME = ['image/jpeg', 'image/jpg', 'image/png'];
const LIMITED_MIME = ['image/bmp', 'application/pdf']; // accepted but flagged as lower accuracy
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

// Catalogue categories the identifier can map an image to (must match the
// product catalogue's category keys).
const CATEGORIES = [
  'cpu', 'gpu', 'ram', 'ssd', 'storage_hdd', 'motherboard', 'monitor',
  'case', 'psu', 'cooler', 'router', 'switch', 'networking', 'webcam',
  'sound_card', 'keyboard', 'mouse', 'mousepad', 'ip_camera', 'peripheral',
  'headset', 'ups', 'nas', 'mini_pc', 'desktop', 'pc_bundle',
];

function getProviderName() {
  return String(process.env.VISION_PROVIDER || 'mock').toLowerCase();
}

/** Validate the upload. Returns { ok, mime, limited, error }. */
function validateImage(buffer, mime) {
  if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
    return { ok: false, error: 'empty_image' };
  }
  if (buffer.length > MAX_BYTES) {
    return { ok: false, error: 'image_too_large' };
  }
  const m = String(mime || '').toLowerCase();
  if (SUPPORTED_MIME.includes(m)) return { ok: true, mime: m, limited: false };
  if (LIMITED_MIME.includes(m)) return { ok: true, mime: m, limited: true };
  return { ok: false, error: 'unsupported_type' };
}

/**
 * MOCK provider: deterministic, no external call. Uses an optional text hint
 * (e.g. the file name or an accompanying caption) to pick a plausible category
 * so the whole flow is demoable. If it cannot infer, returns a low-confidence
 * "gpu" as a neutral default is NOT done - instead returns null so the honest
 * fallback path runs, matching real behaviour when a model is unsure.
 */
function mockIdentify(buffer, mime, hint) {
  const h = String(hint || '').toLowerCase();
  const map = [
    { re: /(gpu|graphic|video\s*card|rtx|radeon|geforce)/, category: 'gpu', label: 'Graphics card' },
    { re: /(cpu|processor|ryzen|intel\s*core|chip)/, category: 'cpu', label: 'Processor' },
    { re: /(ram|memory|dimm|ddr\d)/, category: 'ram', label: 'Memory (RAM)' },
    { re: /(ssd|nvme|m\.?2)/, category: 'ssd', label: 'SSD' },
    { re: /(hdd|hard\s*disk|hard\s*drive)/, category: 'storage_hdd', label: 'Hard disk drive' },
    { re: /(motherboard|mainboard|mobo)/, category: 'motherboard', label: 'Motherboard' },
    { re: /(monitor|screen|display)/, category: 'monitor', label: 'Monitor' },
    { re: /(case|casing|chassis|tower)/, category: 'case', label: 'PC case' },
    { re: /(psu|power\s*supply)/, category: 'psu', label: 'Power supply' },
    { re: /(cooler|aio|heatsink|fan)/, category: 'cooler', label: 'CPU cooler' },
    { re: /(router|wifi|network|switch)/, category: 'networking', label: 'Networking device' },
    { re: /(camera|cctv|ip\s*cam)/, category: 'ip_camera', label: 'IP camera' },
    { re: /(keyboard)/, category: 'keyboard', label: 'Keyboard' },
    { re: /(mousepad|mouse\s*pad)/, category: 'mousepad', label: 'Mouse pad' },
    { re: /(mouse)/, category: 'mouse', label: 'Mouse' },
    { re: /(webcam)/, category: 'webcam', label: 'Webcam' },
    { re: /(headset|headphone)/, category: 'headset', label: 'Headset' },
    { re: /(ups|battery\s*backup)/, category: 'ups', label: 'UPS' },
    { re: /(nas)/, category: 'nas', label: 'NAS' },
    { re: /(mini\s*pc|nuc)/, category: 'mini_pc', label: 'Mini PC' },
  ];
  for (const m of map) {
    if (m.re.test(h)) {
      return { category: m.category, label: m.label, confidence: 0.7, provider: 'mock' };
    }
  }
  // No hint / unrecognizable -> null (honest "couldn't identify" path).
  return null;
}

// Labels the vision model may return, mapped to our catalogue categories.
const LABEL_TO_CATEGORY = {
  keyboard: { category: 'keyboard', label: 'Keyboard' },
  mouse: { category: 'mouse', label: 'Mouse' },
  mousepad: { category: 'mousepad', label: 'Mouse pad' },
  gpu: { category: 'gpu', label: 'Graphics card' },
  'graphics card': { category: 'gpu', label: 'Graphics card' },
  cpu: { category: 'cpu', label: 'Processor (CPU)' },
  processor: { category: 'cpu', label: 'Processor (CPU)' },
  ram: { category: 'ram', label: 'Memory (RAM)' },
  memory: { category: 'ram', label: 'Memory (RAM)' },
  ssd: { category: 'ssd', label: 'SSD' },
  nvme: { category: 'ssd', label: 'SSD' },
  hdd: { category: 'storage_hdd', label: 'Hard disk drive' },
  'hard disk': { category: 'storage_hdd', label: 'Hard disk drive' },
  motherboard: { category: 'motherboard', label: 'Motherboard' },
  monitor: { category: 'monitor', label: 'Monitor' },
  screen: { category: 'monitor', label: 'Monitor' },
  case: { category: 'case', label: 'PC case' },
  psu: { category: 'psu', label: 'Power supply' },
  'power supply': { category: 'psu', label: 'Power supply' },
  cooler: { category: 'cooler', label: 'CPU cooler' },
  fan: { category: 'cooler', label: 'CPU cooler' },
  router: { category: 'router', label: 'Router' },
  switch: { category: 'switch', label: 'Network switch' },
  webcam: { category: 'webcam', label: 'Webcam' },
  camera: { category: 'webcam', label: 'Webcam' },
  soundcard: { category: 'sound_card', label: 'Sound card' },
  nas: { category: 'nas', label: 'NAS' },
  'mini pc': { category: 'mini_pc', label: 'Mini PC' },
};

/** Map a free-text label from the model to a known category. */
function mapLabelToCategory(text) {
  const t = String(text || '').toLowerCase();
  // Longest keys first so "graphics card" wins over "card".
  const keys = Object.keys(LABEL_TO_CATEGORY).sort((a, b) => b.length - a.length);
  for (const k of keys) {
    if (t.includes(k)) return LABEL_TO_CATEGORY[k];
  }
  return null;
}

/**
 * OpenClaw vision adapter. Writes the image to a temp file and asks the
 * authenticated OpenClaw agent (vision-capable model) to classify it into one
 * of our catalogue categories. Safe: any failure/timeout returns null so the
 * caller runs the honest "please describe the item" fallback.
 */
async function openclawIdentify(buffer, mime, hint) {
  // eslint-disable-next-line global-require
  const { spawn } = require('child_process');
  // eslint-disable-next-line global-require
  const fs = require('fs');
  // eslint-disable-next-line global-require
  const os = require('os');
  // eslint-disable-next-line global-require
  const path = require('path');
  // eslint-disable-next-line global-require
  const crypto = require('crypto');

  const bin = process.env.OPENCLAW_BIN || 'openclaw';
  const timeoutMs = parseInt(process.env.VISION_TIMEOUT_MS, 10) || 60000;
  const ext = mime === 'image/png' ? 'png' : 'jpg';
  const imgPath = path.join(os.tmpdir(), `vis_${crypto.randomBytes(6).toString('hex')}.${ext}`);
  const promptPath = path.join(os.tmpdir(), `vis_${crypto.randomBytes(6).toString('hex')}.txt`);

  const categories =
    'keyboard, mouse, mousepad, gpu, cpu, ram, ssd, hdd, motherboard, monitor, case, psu, cooler, router, switch, webcam, soundcard, nas, mini pc';
  const prompt =
    `Read the image file at ${imgPath}. It is a photo of a computer product a customer wants to price. ` +
    `Identify what it is and reply with ONLY one short category label from this list: ${categories}. ` +
    `If it clearly does not match any, reply exactly: unknown. Reply with just the label, nothing else.`;

  try {
    fs.writeFileSync(imgPath, buffer);
    fs.writeFileSync(promptPath, prompt, 'utf8');
  } catch (err) {
    return null;
  }

  const cleanup = () => {
    fs.unlink(imgPath, () => {});
    fs.unlink(promptPath, () => {});
  };

  return new Promise((resolve) => {
    // --thinking off keeps the call lightweight (a simple label classification
    // needs no chain-of-thought), which is faster and easier on rate limits.
    const child = spawn(
      bin,
      ['agent', '--message-file', promptPath, '--thinking', 'off', '--timeout', '55'],
      { stdio: ['ignore', 'pipe', 'pipe'] }
    );
    let out = '';
    const timer = setTimeout(() => child.kill('SIGKILL'), timeoutMs);
    child.stdout.on('data', (d) => { out += d.toString(); });
    child.stderr.on('data', () => {});
    child.on('error', () => { clearTimeout(timer); cleanup(); resolve(null); });
    child.on('close', () => {
      clearTimeout(timer);
      cleanup();
      // Take the last non-empty line as the label (agents may print status lines).
      const lines = out.split('\n').map((l) => l.trim()).filter(Boolean);
      const last = lines[lines.length - 1] || '';
      if (/rate limit|error|could not/i.test(last)) return resolve(null);
      const mapped = mapLabelToCategory(last) || mapLabelToCategory(out);
      if (!mapped) return resolve(null);
      resolve({ category: mapped.category, label: mapped.label, confidence: 0.8, provider: 'openclaw' });
    });
  });
}

/** Real adapters. openclaw = authenticated vision agent; others = stub. */
async function realIdentify(providerName, buffer, mime, hint) {
  if (providerName === 'openclaw') {
    return openclawIdentify(buffer, mime, hint);
  }
  const err = new Error(
    `Vision provider "${providerName}" is not configured. ` +
      'Set VISION_PROVIDER=openclaw (server) or mock (demo), or implement the adapter with valid credentials.'
  );
  err.code = 'VISION_NOT_CONFIGURED';
  throw err;
}

/**
 * Identify a product category from an image.
 * @param {Buffer} buffer
 * @param {string} mime
 * @param {string} [hint] optional filename/caption to help the mock
 * @returns {Promise<null | {category, label, confidence, provider, limited?}>}
 */
async function identifyImage(buffer, mime, hint) {
  const v = validateImage(buffer, mime);
  if (!v.ok) return { error: v.error, category: null };

  const providerName = getProviderName();
  try {
    let result;
    if (providerName === 'mock') {
      result = mockIdentify(buffer, mime, hint);
    } else {
      result = await realIdentify(providerName, buffer, mime, hint);
    }
    if (!result || !CATEGORIES.includes(result.category)) return null;
    if (v.limited) result.limited = true;
    return result;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[vision] identify failed, falling back:', err.message);
    return null;
  }
}

module.exports = {
  identifyImage,
  validateImage,
  getProviderName,
  SUPPORTED_MIME,
  LIMITED_MIME,
  MAX_BYTES,
  CATEGORIES,
  _internal: { mockIdentify, realIdentify },
};
