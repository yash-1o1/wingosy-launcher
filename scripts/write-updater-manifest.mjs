/**
 * Build `latest.json` for the Tauri v2 signed updater and upload it to the current GitHub release.
 *
 * Expects (after `npm run build && tauri build`):
 * - `src-tauri/target/release/bundle/nsis/*-setup.exe` and matching `*.sig`
 *
 * Environment:
 * - `GITHUB_REPOSITORY` — `owner/repo` (set automatically in Actions)
 * - `RELEASE_TAG` — tag for this release (caller sets: stable tag, beta-*, nightly-*)
 * - `GITHUB_TOKEN` — for `gh release upload`
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const nsisDir = join(root, "src-tauri", "target", "release", "bundle", "nsis");

const repo = process.env.GITHUB_REPOSITORY;
const tag = process.env.RELEASE_TAG || process.env.GITHUB_REF_NAME;
const token = process.env.GITHUB_TOKEN;

if (!repo || !tag) {
  console.error("write-updater-manifest: missing GITHUB_REPOSITORY or RELEASE_TAG");
  process.exit(1);
}
if (!token) {
  console.error("write-updater-manifest: missing GITHUB_TOKEN");
  process.exit(1);
}

if (!existsSync(nsisDir)) {
  console.error(`write-updater-manifest: NSIS bundle dir missing: ${nsisDir}`);
  process.exit(1);
}

const files = readdirSync(nsisDir);
const exe = files.find((f) => f.endsWith("-setup.exe") && !f.endsWith(".exe.sig"));
const sigFile = exe ? files.find((f) => f === `${exe}.sig`) : null;

if (!exe || !sigFile) {
  console.error("write-updater-manifest: could not find *-setup.exe and matching .sig in", nsisDir);
  console.error("files:", files.join(", "));
  process.exit(1);
}

const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const version = pkg.version;
const signature = readFileSync(join(nsisDir, sigFile), "utf8").trim();

const assetUrl = `https://github.com/${repo}/releases/download/${encodeURIComponent(tag)}/${encodeURIComponent(exe)}`;

const manifest = {
  version,
  notes: "",
  pub_date: new Date().toISOString(),
  platforms: {
    "windows-x86_64": {
      signature,
      url: assetUrl,
    },
  },
};

const outPath = join(root, "latest.json");
writeFileSync(outPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
console.log("Wrote", outPath);

execFileSync(
  "gh",
  ["release", "upload", tag, outPath, "--clobber", "--repo", repo],
  {
    stdio: "inherit",
    env: { ...process.env, GH_TOKEN: token },
  }
);
console.log(`Uploaded latest.json to release ${tag}`);
