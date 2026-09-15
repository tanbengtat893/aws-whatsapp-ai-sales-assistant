'use strict';

/**
 * Menu & greeting service for the BIS Computer Services hybrid assistant.
 *
 * Supports the "quick menu OR type naturally" flow:
 *   - greetings ("hi", "hello", "你好", "selamat pagi") -> branded welcome + menu
 *   - a menu selection ("1".."7", or option words like "repair") -> guided reply
 *     or a routing decision (product search / repair / onsite / human handover)
 *
 * Pure and deterministic: no external calls. The webhook pipeline consults this
 * BEFORE FAQ/product/AI so greetings never wrongly escalate and numbers route.
 */

const BUSINESS_NAME = 'BIS Computer Services';

/** The seven quick-menu options. `route` tells the pipeline what to do next. */
const MENU_OPTIONS = [
  { id: 1, label: 'Computer Components', emoji: '🖥️', route: 'product_components' },
  { id: 2, label: 'DIY PC Package', emoji: '🛠️', route: 'pc_bundle' },
  { id: 3, label: 'Carry-in Service', emoji: '🔧', route: 'repair' },
  { id: 4, label: 'Onsite Repair', emoji: '🚗', route: 'onsite' },
  { id: 5, label: 'Product Availability', emoji: '📦', route: 'product_availability' },
  { id: 6, label: 'Talk to Sales', emoji: '👨‍💼', route: 'human' },
  { id: 7, label: 'Delivery Status', emoji: '🚚', route: 'delivery_status' },
  { id: 8, label: 'Warranty Status', emoji: '🛡️', route: 'warranty' },
  { id: 9, label: 'About Us', emoji: 'ℹ️', route: 'about' },
];

// Greeting words across the three supported languages.
const GREETING_PATTERNS = [
  /\bhi\b/, /\bhello\b/, /\bhey\b/, /\bhai\b/, /good\s*(morning|afternoon|evening|day)/,
  /\bhelp\b/, /\bmenu\b/, /\bstart\b/,
  /selamat\s*(pagi|petang|tengah\s*hari|malam)/, /\bhelo\b/, /\bassalamualaikum\b/,
  /你好/, /您好/, /哈罗/, /在吗/, /开始/, /菜单/,
];

function lower(s) {
  return typeof s === 'string' ? s.toLowerCase().trim() : '';
}

/** Is this message essentially a greeting / conversation opener? */
function isGreeting(text) {
  const t = lower(text);
  if (!t) return false;
  // Keep it to short openers so "hi, how much is the RTX 5070" is NOT a greeting.
  const wordCount = t.split(/\s+/).length;
  if (wordCount > 6) return false;
  return GREETING_PATTERNS.some((re) => re.test(t));
}

/**
 * Detect a menu selection. Accepts a bare number "1".."7", "option 3",
 * "#2", or an option label/keyword ("repair", "onsite", "delivery").
 * Returns the matched option object, or null.
 */
function detectMenuChoice(text) {
  const t = lower(text);
  if (!t) return null;

  // Bare number or "option N" / "#N" - only when the message is essentially just that.
  const numMatch = t.match(/^(?:option\s*|#\s*)?([1-9])\b\.?$/);
  if (numMatch) {
    const id = parseInt(numMatch[1], 10);
    return MENU_OPTIONS.find((o) => o.id === id) || null;
  }

  // Label keywords (only for short messages, to avoid hijacking real questions).
  if (t.split(/\s+/).length <= 4) {
    const keywordMap = [
      { re: /(computer\s*component|components?)\b/, id: 1 },
      { re: /(diy|pc\s*package|build\s*a?\s*pc)\b/, id: 2 },
      { re: /(carry[- ]?in|service\s*cent(er|re)|drop[- ]?off|bring\s*in|pc\s*repair|fix\s*my\s*pc|repair)\b/, id: 3 },
      { re: /(onsite|on-site|come\s*to)\b/, id: 4 },
      // Delivery / payment / status keywords all route to Delivery Status
      // (option 7) now that option 5 is Product Availability.
      { re: /(delivery\s*status|track|tracking|where\s*is\s*my|my\s*order|my\s*delivery|delivery|payment|shipping)\b/, id: 7 },
      { re: /(product\s*availability|availability|in\s*stock|stock\s*level|stock\s*check|check\s*stock|have\s*stock)\b/, id: 5 },
      { re: /(talk\s*to\s*sales|sales|agent|human|rep)\b/, id: 6 },
      { re: /(warranty|guarantee|coverage|serial)\b/, id: 8 },
      { re: /(general\s*info|information|about)\b/, id: 9 },
    ];
    for (const k of keywordMap) {
      if (k.re.test(t)) return MENU_OPTIONS.find((o) => o.id === k.id) || null;
    }
  }
  return null;
}

/**
 * Detect a bare number that is NOT a valid menu option (e.g. "8", "0", "99").
 * Only fires when the message is essentially just that number, so free text
 * like "how much is 1 RTX 5070" is not treated as a menu number.
 * Returns the number as a string when invalid, else null.
 */
function detectInvalidMenuNumber(text) {
  const t = lower(text);
  const m = t.match(/^(?:option\s*|#\s*)?(\d{1,3})\b\.?$/);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  if (n >= 1 && n <= 9) return null; // valid option, handled elsewhere
  return m[1];
}

/** Short "invalid option" alert followed by the menu, so the customer can retry. */
function buildInvalidOption(entered) {
  return (
    `⚠️ "${entered}" isn't a valid option. Please choose a number from 1 to 9 below, ` +
    `or just type your question and I'll help.\n\n` +
    buildWelcome()
  );
}

/** The branded welcome message with the numbered menu. */
function buildWelcome() {
  const lines = [
    `👋 Hi! Welcome to ${BUSINESS_NAME}.`,
    '',
    "I'm your AI Sales & Service Assistant. I can help you 24/7 with products, PC builds and repair services.",
    '',
    'Quick options (reply with a number):',
  ];
  for (const o of MENU_OPTIONS) {
    lines.push(`${o.id}. ${o.emoji} ${o.label}`);
  }
  // Un-numbered Language option (English / 中文 / Bahasa Melayu).
  lines.push('🌐 Language');
  lines.push('');
  lines.push('Or simply type your question, e.g. "Do you have 32GB DDR5 RAM?" or "PC won\'t turn on, how much to fix?"');
  return lines.join('\n');
}

/**
 * Universal "go to main menu" command, usable at any step. Accepts "0",
 * "menu", "home", "main menu", "start over", and MS/ZH equivalents.
 * Only fires when the message is essentially just that command (short), so a
 * real question containing the word "menu" is not hijacked.
 */
function isHomeCommand(text) {
  const t = lower(text);
  if (!t) return false;
  if (t.split(/\s+/).length > 3) return false;
  return /^(0|menu|home|main\s*menu|start\s*over|restart|主菜单|菜单|首页|menu\s*utama|halaman\s*utama)\.?$/.test(t);
}

/**
 * Universal "go back one step" command, usable inside multi-step flows.
 * Accepts "back", "previous", "prev", "go back", and MS/ZH equivalents.
 */
function isBackCommand(text) {
  const t = lower(text);
  if (!t) return false;
  if (t.split(/\s+/).length > 3) return false;
  return /^(back|previous|prev|go\s*back|返回|上一步|kembali|undur)\.?$/.test(t);
}

/** Is the message a request to change/choose the language? */
function isLanguageRequest(text) {
  const t = lower(text);
  if (!t) return false;
  return /^(language|lang|languages|bahasa|语言|語言|change\s*language|select\s*language)\.?$/.test(t);
}

/**
 * Detect a language choice from the picker. Accepts the language names, native
 * names, flags, or short codes. Returns 'en' | 'ms' | 'zh' | null.
 */
function detectLanguageChoice(text) {
  const t = lower(text).trim();
  if (!t) return null;
  // Numbered picker: 1 = English, 2 = 中文, 3 = Bahasa Melayu (tolerates "option 2", "#3").
  const numMatch = t.match(/^(?:option\s*|#\s*|no\.?\s*)?([123])\b\.?$/);
  if (numMatch) {
    return { 1: 'en', 2: 'zh', 3: 'ms' }[parseInt(numMatch[1], 10)] || null;
  }
  // Chinese
  if (/(中文|chinese|zh|华语|華語|普通话|mandarin|🇨🇳)/.test(t)) return 'zh';
  // Malay
  if (/(bahasa\s*melayu|bahasa|melayu|malay|ms|🇲🇾)/.test(t)) return 'ms';
  // English
  if (/(english|eng|en|🇬🇧|🇺🇸)/.test(t)) return 'en';
  return null;
}

/**
 * Guided response for a chosen menu option. For options that map to existing
 * capabilities (components, DIY, delivery) we prompt for the next detail; for
 * repair/onsite we acknowledge and gather info; option 7 signals human handover.
 *
 * @returns {{ reply: string|null, route: string, escalate: boolean, reason?: string }}
 */
function buildMenuResponse(option, lang) {
  // eslint-disable-next-line global-require
  const i18n = require('./i18n.service');
  const lng = lang || 'en';
  switch (option.route) {
    case 'product_components':
      return {
        route: option.route,
        escalate: false,
        reply: i18n.t(lng, 'menu_components'),
      };
    case 'pc_bundle':
      return {
        route: option.route,
        escalate: false,
        reply: i18n.t(lng, 'menu_pc_bundle'),
      };
    case 'repair':
      return {
        route: option.route,
        escalate: false,
        reply: i18n.t(lng, 'carry_in'),
      };
    case 'onsite':
      return {
        route: option.route,
        escalate: false,
        reply: i18n.t(lng, 'onsite_intro'),
      };
    case 'product_availability':
      return {
        route: option.route,
        escalate: false,
        reply: i18n.t(lng, 'menu_product_availability'),
      };
    case 'about':
      return {
        route: option.route,
        escalate: false,
        reply: i18n.t(lng, 'about'),
      };
    case 'delivery_status':
      return {
        route: option.route,
        escalate: false,
        reply: i18n.t(lng, 'delivery_status_prompt'),
      };
    case 'warranty':
      return {
        route: option.route,
        escalate: false,
        reply: i18n.t(lng, 'warranty_prompt'),
      };
    case 'human':
      return {
        route: option.route,
        escalate: true,
        reason: 'human_requested',
        reply: null, // pipeline sends the localized acknowledgement
      };
    default:
      return { route: 'general', escalate: false, reply: buildWelcome() };
  }
}

module.exports = {
  BUSINESS_NAME,
  MENU_OPTIONS,
  isGreeting,
  detectMenuChoice,
  detectInvalidMenuNumber,
  buildWelcome,
  buildInvalidOption,
  buildMenuResponse,
  isLanguageRequest,
  detectLanguageChoice,
  isHomeCommand,
  isBackCommand,
};
