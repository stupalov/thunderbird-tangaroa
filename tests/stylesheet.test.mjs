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
