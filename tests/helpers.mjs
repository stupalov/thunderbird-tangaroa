import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

export function readManifest() {
  return JSON.parse(readFileSync(join(root, "theme", "manifest.json"), "utf8"));
}

export function readStylesheet() {
  return readFileSync(join(root, "theme", "tangaroa.css"), "utf8");
}
