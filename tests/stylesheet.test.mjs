import { test } from "node:test";
import assert from "node:assert/strict";
import { readManifest, readStylesheet } from "./helpers.mjs";

test("stylesheet declares a default for every mapped variable and uses only declared variables", () => {
  const css = readStylesheet(); const m = readManifest();
  const declared = new Set([...css.matchAll(/--tg-[a-z0-9-]+(?=\s*:)/g)].map(x => x[0]));
  for (const v of Object.values(m.theme_experiment.colors)) assert.ok(declared.has(v), v + " has no :root default");
  for (const [, v] of css.matchAll(/var\((--tg-[a-z0-9-]+)/g)) assert.ok(declared.has(v), v + " used but never declared");
});
test("stylesheet carries no userChrome leftovers", () => {
  const css = readStylesheet();
  assert.doesNotMatch(css, /--pb-/); assert.doesNotMatch(css, /@-moz-document/); assert.doesNotMatch(css, /@import/);
});
test("stylesheet styles both table rows and cards and never forces row height", () => {
  const css = readStylesheet();
  assert.match(css, /tr\.table-layout/); assert.match(css, /tr\.card-layout/);
  assert.doesNotMatch(css, /#threadTree[^{]*\{[^}]*\bheight\s*:/);
  assert.doesNotMatch(css, /--list-item-min-height\s*:\s*\d/, "folder rows keep Thunderbird's height");
});
test("stylesheet sets the sidebar variables AccountPane reads", () => {
  const css = readStylesheet();
  for (const v of ["--sidebar-background", "--sidebar-color", "--treeitem-background-active", "--list-container-background-selected-focused", "--folderpane-unread-count-background", "--folderpane-unread-count-text"]) assert.match(css, new RegExp(v + "\\s*:"));
});
test("stylesheet :root defaults equal the manifest's light colours", () => {
  const css = readStylesheet(); const m = readManifest();
  const block = css.match(/(?:^|\n):root\s*\{([^}]*)\}/)[1];
  const defaults = Object.fromEntries([...block.matchAll(/(--tg-[a-z0-9-]+)\s*:\s*([^;]+);/g)].map(x => [x[1], x[2].trim()]));
  for (const [key, v] of Object.entries(m.theme_experiment.colors)) assert.equal(defaults[v], m.theme.colors[key], v + " default differs from theme.colors." + key);
});
test("typography :root rule is scoped to the mail documents", () => {
  const css = readStylesheet();
  assert.match(css, /:root:is\(:has\(#tabmail\)/);
  assert.doesNotMatch(css, /:root\s*\{[^}]*(?<![\w-])font-size\s*:/, "an unscoped :root block sets font-size");
});
test("every mapped variable is used inside var() in the stylesheet", () => {
  const css = readStylesheet(); const m = readManifest();
  const used = new Set([...css.matchAll(/var\((--tg-[a-z0-9-]+)/g)].map(x => x[1]));
  for (const v of Object.values(m.theme_experiment.colors)) assert.ok(used.has(v), v + " is mapped but never used");
});
