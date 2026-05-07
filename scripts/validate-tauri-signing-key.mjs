#!/usr/bin/env node
/**
 * CI guard: TAURI_SIGNING_PRIVATE_KEY must be valid minisign private key material.
 * Reads env TAURI_SIGNING_PRIVATE_KEY only (never prints it).
 *
 * GitHub Actions multiline secrets must contain the full key including the first line:
 *   untrusted comment: ...
 */
/* eslint-disable no-console */

const raw = process.env.TAURI_SIGNING_PRIVATE_KEY;

if (raw == null || String(raw).trim() === "") {
  console.error(
    `[validate-tauri-signing-key] TAURI_SIGNING_PRIVATE_KEY is missing or empty.

Add a repository secret (Settings → Secrets and variables → Actions → New repository secret):
  Name:  TAURI_SIGNING_PRIVATE_KEY
  Value: full contents of src-tauri/tauri-signing.key from "npm run tauri -- signer generate"

The value must include the first line starting with: untrusted comment:
Paste the entire file; do not use the .pub file or only the second line.
`.trim()
  );
  process.exit(1);
}

let text = String(raw).trim();

// Some teams store a single base64 line wrapping the whole key file — decode once.
if (!text.includes("\n") && /^[A-Za-z0-9+/=\s]+$/.test(text.replace(/\s/g, ""))) {
  try {
    const buf = Buffer.from(text.replace(/\s/g, ""), "base64");
    const decoded = buf.toString("utf8");
    if (decoded.includes("untrusted comment:")) {
      text = decoded.trim();
    }
  } catch {
    // keep original text
  }
}

const firstLine = text.split(/\r?\n/)[0] ?? "";

if (!firstLine.startsWith("untrusted comment:")) {
  console.error(
    `[validate-tauri-signing-key] Private key must start with a line: untrusted comment: ...

First line was (${firstLine.length} chars): ${JSON.stringify(firstLine.slice(0, 80))}…

Typical mistakes:
- Pasted only the second line (base64 block) — include line 1.
- Pasted the .pub (public) key — use tauri-signing.key, not tauri-signing.key.pub.
- Extra quotes wrapping the secret in GitHub UI — re-paste without JSON quotes.
`.trim()
  );
  process.exit(1);
}

if (/minisign public key/i.test(firstLine) && !/encrypted secret key|secret key|rsign/i.test(text.slice(0, 200))) {
  console.error(
    `[validate-tauri-signing-key] This looks like a PUBLIC key (minisign public key).

Use the private key file from signer generate (often named tauri-signing.key), not the .pub file.
`.trim()
  );
  process.exit(1);
}

console.log("[validate-tauri-signing-key] OK: TAURI_SIGNING_PRIVATE_KEY format looks valid.");
