// One Emoji, One Smile — entry program.
//
// The competition: write exactly one emoji to /output/entry.txt. An AI
// warmth judge compares entries two at a time and picks the one more
// likely to make a stranger smile, weighing (in order): warm and
// friendly, warmth at first glance, universality, chosen rather than
// default, and right for a stranger (no intimacy, sarcasm, flirtation).
//
// Candidates I weighed before picking:
//   1. 😊  — the default warm smile. Loses on "chosen rather than
//            default": it is the first smiley that comes to mind.
//   2. 🌞 — smiling sun. Literal warmth, beaming, universal, no
//            intimacy risk. But a sun is cheerful, not a person being
//            friendly, so it is a touch weaker on criterion 1.
//   3. 🫶 — heart hands. Warm gesture, distinctive, universal. But
//            hands alone carry no smile, so it is less likely to make
//            a stranger actually smile than a smiling face.
//   4. 😇 — smiling face with halo. Sweet and innocent, distinctive,
//            no intimacy. But a quiet, gentle smile with less warmth
//            punch than an open-armed one.
//   5. 🤗 — hugging face. CHOSEN. A big smile plus open arms offering
//            a hug: the strongest on criteria 1 and 2 (warmest and
//            friendliest at first glance), universally read as a
//            friendly virtual hug, clearly picked rather than default,
//            and — unlike 🥰 or 😘 — a hug reads as friendly, not
//            romantic or flirtatious, from a stranger, so it clears
//            criterion 5 too.
//
// The entry is a single code point (U+1F917), 1 character, 4 bytes UTF-8,
// inside the gate's 1–8 character window.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Resolve paths from this script's own location, never process.cwd():
// the grader may run us from any working directory.
const scriptDir = dirname(fileURLToPath(import.meta.url));

const EMOJI = "🤗";

function outputDir(): string {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  if (fromEnv && fromEnv.trim().length > 0) {
    return fromEnv;
  }
  return "/output";
}

function main(): void {
  // Validate the entry against the gate before writing anything: the
  // sealed scorer requires UTF-8 text of 1 to 8 characters, not only
  // white space. Fail loudly instead of shipping an invalid entry.
  const chars = [...EMOJI];
  if (chars.length !== 1) {
    throw new Error(`entry must be exactly one emoji, got ${chars.length} characters`);
  }
  if (EMOJI.trim().length === 0) {
    throw new Error("entry must not be only white space");
  }
  const bytes = Buffer.byteLength(EMOJI, "utf8");
  if (bytes < 1 || bytes > 8) {
    throw new Error(`entry must be 1-8 bytes, got ${bytes}`);
  }
  const outDir = outputDir();
  mkdirSync(outDir, { recursive: true });
  const target = join(outDir, "entry.txt");
  writeFileSync(target, EMOJI, "utf8");
  // Keep a trace in the run log only; nothing extra goes into entry.txt.
  console.log(`wrote ${EMOJI} to ${target} (from ${scriptDir})`);
}

try {
  main();
} catch (err) {
  console.error(`entry failed: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
}
