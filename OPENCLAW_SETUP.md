# OpenClaw Gateway Integration

This document explains how the WhatsApp Sales Assistant integrates with the **OpenClaw** AI gateway on the AWS **Ubuntu** instance, and how to verify the setup. It is written as evidence for reviewers and as an operational checklist for the team.

> **Competition context:** the application runs on an AWS Ubuntu (Lightsail) instance and uses the OpenClaw gateway for its AI reasoning. The application itself was built with the Kiro IDE using a spec-driven workflow (see `.kiro/specs/`). This document describes the OpenClaw side.

---

## 1. Where OpenClaw is used

OpenClaw is an **optional, safe AI layer**. The deterministic core (catalogue lookups, pricing, stock, warranty) never depends on it. If OpenClaw is disabled or unavailable, the app falls back automatically and keeps working. There are two integration points, both calling the locally-running `openclaw agent` CLI on the server:

| # | Feature | Source file | What OpenClaw does |
|---|---|---|---|
| 1 | **Intent extraction** | `src/services/ai/openclaw.client.js` | Parses a vague natural-language message into structured intent (domain, category, budget, keywords, wants-human) as JSON. |
| 2 | **Image identification (vision)** | `src/services/ai/vision.provider.js` | Classifies an uploaded product photo into a catalogue category label. |

Both are invoked as a child process: `openclaw agent --message-file <file> ...`, run against the gateway listening locally on the server.

---

## 2. Environment flags (server)

The app reads these environment variables (set in the server's `.env`, started via PM2):

| Variable | Value on server | Meaning |
|---|---|---|
| `USE_OPENCLAW` | `true` | Turns on the OpenClaw intent-extraction path. When `false` (local/tests), the deterministic matcher is used. |
| `VISION_PROVIDER` | `openclaw` | Routes image identification to the OpenClaw vision adapter. |
| `OPENCLAW_BIN` | `openclaw` (default) | Path/name of the OpenClaw CLI on the server. |
| `OPENCLAW_TIMEOUT_MS` | `20000` (default) | Max wait for intent extraction before falling back. |
| `VISION_TIMEOUT_MS` | `60000` (default) | Max wait for image classification before falling back. |

> Design guarantee: any timeout, error, or unparseable output returns `null`, and the customer is served by the deterministic path instead. The bot never hangs or crashes because of the AI layer.

---

## 3. Installing OpenClaw on the Ubuntu instance

OpenClaw installs through its onboarding wizard. During setup it lets you point the provider at any **Ollama-compatible URL**, which is written to its config file:

- Config file: `~/.openclaw/openclaw.json`
- Provider setting: `provider.api: "ollama"` (Ollama-compatible endpoint)

After the wizard completes, confirm the binary is on `PATH` for the `ubuntu` user so the Node app (running under PM2 as `ubuntu`) can spawn it.

---

## 4. Verification commands (run on the Ubuntu instance)

SSH into the server first, then run these. Capture the output as screenshots for the submission.

**4.1 — OpenClaw is installed and on PATH**

```bash
which openclaw
openclaw --version
```

**4.2 — OpenClaw config points at an Ollama-compatible provider**

```bash
cat ~/.openclaw/openclaw.json
# Look for:  "provider": { "api": "ollama", ... }
```

**4.3 — A direct agent call returns a response (gateway reachable)**

```bash
echo 'Reply with the single word: ok' > /tmp/oc_check.txt
openclaw agent --message-file /tmp/oc_check.txt --timeout 30
```

**4.4 — The app is running with OpenClaw enabled**

```bash
pm2 status
pm2 env 0 | grep -E 'USE_OPENCLAW|VISION_PROVIDER'
# Expect: USE_OPENCLAW=true and VISION_PROVIDER=openclaw
```

**4.5 — End-to-end: a natural-language query through the live app**

```bash
curl -s -X POST http://localhost:3000/webhook \
  -H 'Content-Type: application/json' \
  -d '{"from":"verify_openclaw","text":"something quiet and cheap for my kid to type on"}'
```

A relevant keyboard/peripheral shortlist in the reply indicates the intent layer (deterministic, optionally OpenClaw-assisted) is working end to end.

---

## 5. What to screenshot for the submission

1. `openclaw --version` output (proves OpenClaw is installed on Ubuntu).
2. `cat ~/.openclaw/openclaw.json` showing `provider.api: "ollama"` (proves the Ollama-compatible configuration).
3. `pm2 status` + the `USE_OPENCLAW`/`VISION_PROVIDER` env grep (proves the app runs with OpenClaw enabled).
4. The live `/health` check returning `{"status":"ok"}` (proves the app is running on the instance).

---

## 6. How this maps to the competition requirements

| Requirement | How it is met | Evidence |
|---|---|---|
| Runs on an AWS **Ubuntu** instance | Deployed on AWS Lightsail (Ubuntu) under PM2 | `DEPLOY.md`, `/health` endpoint |
| Uses **OpenClaw** | Two integration points call the `openclaw agent` gateway; enabled via `USE_OPENCLAW=true` / `VISION_PROVIDER=openclaw` | `src/services/ai/openclaw.client.js`, `src/services/ai/vision.provider.js` |
| OpenClaw points at an **Ollama-compatible** URL | Configured in `~/.openclaw/openclaw.json` (`provider.api: "ollama"`) via the onboarding wizard | Section 4.2 screenshot |
| Built with **Kiro** (spec-driven) | Requirements → design → tasks, steering, and hooks | `.kiro/specs/`, `.kiro/steering/`, `.kiro/hooks/` |
| A working, deployed application | Full customer journey live; 348 tests / 19 suites | `docs/COMPETITION_REPORT.md`, `npm test` |
