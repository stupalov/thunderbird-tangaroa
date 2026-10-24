import { test } from "node:test";
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import { readManifest } from "./helpers.mjs";

test("manifest is a static theme for Thunderbird 157+", () => {
  const m = readManifest();
  assert.deepEqual(Object.keys(m).sort(), ["browser_specific_settings","dark_theme","description","icons","manifest_version","name","theme","theme_experiment","version"]);
  assert.equal(m.manifest_version, 2); assert.equal(m.version, "0.2.1"); assert.equal(m.name, "Tangaroa");
  assert.deepEqual(m.browser_specific_settings.gecko, { id: "tangaroa@stupalov.github.io", strict_min_version: "157.0", strict_max_version: "*" });
  assert.deepEqual(m.icons, { "32": "icons/tangaroa-32.png", "48": "icons/tangaroa-48.png", "64": "icons/tangaroa-64.png" });
});
test("light and dark variants define the same colour keys and opposite colour schemes", () => {
  const m = readManifest();
  assert.deepEqual(Object.keys(m.theme.colors).sort(), Object.keys(m.dark_theme.colors).sort());
  assert.deepEqual(m.theme.properties, { color_scheme: "light", content_color_scheme: "light" });
  assert.deepEqual(m.dark_theme.properties, { color_scheme: "dark", content_color_scheme: "dark" });
});
test("every custom key is mapped to a --tg- variable and only custom keys are mapped", () => {
  const m = readManifest();
  const custom = Object.keys(m.theme.colors).filter(k => k.startsWith("tg_"));
  assert.deepEqual(Object.keys(m.theme_experiment.colors).sort(), custom.sort());
  for (const [key, variable] of Object.entries(m.theme_experiment.colors)) assert.equal(variable, "--" + key.replaceAll("_", "-"));
  assert.equal(m.theme_experiment.stylesheet, "tangaroa.css");
});
test("light palette is the Postbox Tangaroa export", () => {
  const c = readManifest().theme.colors;
  assert.equal(c.tg_bg_primary, "#F9FAFC"); assert.equal(c.tg_bg_sidebar, "#1E2D3F"); assert.equal(c.tg_selector, "#55ADF8");
  assert.equal(c.tg_folder_bubble_bg, "#dd491a"); assert.equal(c.tg_toolbar_top, "#E2E7EE"); assert.equal(c.tg_toolbar_bottom, "#C5D0DD");
});
test("dark palette keeps the Tangaroa key colours", () => {
  const c = readManifest().dark_theme.colors;
  assert.equal(c.tg_selector, "#55ADF8"); assert.equal(c.tg_folder_bubble_bg, "#dd491a"); assert.equal(c.tg_bg_sidebar, "#1E2D3F");
  assert.equal(c.tg_bg_primary, "#16222F");
});
test("icon files referenced by the manifest exist and are PNG", () => {
  for (const file of Object.values(readManifest().icons)) {
    const bytes = readFileSync(new URL("../theme/" + file, import.meta.url));
    assert.deepEqual([...bytes.subarray(0, 4)], [0x89, 0x50, 0x4e, 0x47]);
  }
});
test("theme/preview.png is a 680x92 PNG", () => {
  const bytes = readFileSync(new URL("../theme/preview.png", import.meta.url));
  assert.deepEqual([...bytes.subarray(0, 4)], [0x89, 0x50, 0x4e, 0x47]);
  assert.equal(bytes.readUInt32BE(16), 680);
  assert.equal(bytes.readUInt32BE(20), 92);
});
