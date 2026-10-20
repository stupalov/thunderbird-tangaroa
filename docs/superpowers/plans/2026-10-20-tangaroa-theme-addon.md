# Tangaroa Theme Add-on Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the Tangaroa userChrome kit into one installable Thunderbird static theme (`tangaroa-0.2.0.xpi`) with a light Tangaroa variant and a dark Midnight-based variant that follows the system colour scheme.

**Architecture:** A static theme (`manifest_version` 2, no scripts) whose `theme` and `dark_theme` blocks carry the two palettes through the standard colour keys plus custom `tg_*` keys; `theme_experiment` maps the custom keys to `--tg-*` CSS variables and loads `tangaroa.css`, a port of the 0.1.0 component stylesheets. A Python build script packs a reviewed allowlist into a reproducible XPI; Node tests check manifest shape, palette parity and stylesheet/variable consistency.

**Tech Stack:** Thunderbird WebExtension static theme with `theme_experiment`; CSS; Python 3 (`zipfile`) for the build; Node `node:test` for tests; `sharp` (from the AccountPane checkout) only for icon rendering; `prlctl` keyboard harness for Windows checks.

**Spec:** `docs/superpowers/specs/2026-10-20-tangaroa-theme-addon-design.md`

## Global Constraints

- Thunderbird `strict_min_version: "157.0"`, `strict_max_version: "*"`; extension id `tangaroa@stupalov.github.io`; version `0.2.0`.
- Static theme only: manifest keys `manifest_version`, `name`, `description`, `version`, `browser_specific_settings`, `icons`, `theme`, `dark_theme`, `theme_experiment`. No `background`, no `permissions`.
- No profile preferences are set or required; row heights are never forced through CSS; both table and card message lists must look right.
- Light palette = Postbox Tangaroa export values unchanged; dark palette = the table in the spec (hue ≈ 213°, key colours `#55ADF8`, `#dd491a`, `#1E2D3F`), tuned only against the Postbox Midnight reference.
- `theme.colors` and `dark_theme.colors` define the same key set; every `theme_experiment.colors` key maps to a `--tg-*` variable used by `tangaroa.css`.
- AccountPane is not modified; the theme sets Thunderbird's sidebar/list variables that AccountPane reads.
- No network, no telemetry, MIT licence, Postbird attribution kept. Build and tests run without npm dependencies.
- Spike failure (stylesheet not reaching `about:3pane`/`about:message`, or `dark_theme` not switching) stops the work and the user decides.
- Commits go to `main` of `thunderbird-tangaroa`; release only on the user's go-ahead.

## Review Focus

1. Windows dark mode with "System theme — auto" in Thunderbird: the message header, menus and text fields must be readable in the dark variant — pinned by Task 7 (dark-mode Windows capture of the header and the folder-pane context menu).
2. Card view (the Thunderbird default for a fresh profile): cards must show themed backgrounds and readable text, not table-only rules — pinned by Task 4 (stylesheet rule check) and Task 6 (card-view capture).
3. AccountPane rows inside the themed folder pane: selection, hover and counters must use the theme's sidebar variables — pinned by Task 6 (capture with AccountPane active).
4. Installing the theme over the old userChrome kit: a profile that still has `chrome/userChrome.css` shows the theme once, not twice; the README must tell those users to remove the kit — pinned by Task 5 (README migration section) and Task 7 (profile with kit removed renders the same).
5. Thunderbird versions without `theme_experiment` stylesheet support would leave only colours: the manifest minimum 157.0 already guarantees support; a test pins the minimum so it is not lowered — pinned by Task 2.

---

### Task 1: Spike: theme_experiment stylesheet and dark_theme on Thunderbird 158

**Files:**
- Create (throwaway, in scratch, not committed): `spike/manifest.json`, `spike/spike.css`
- Reuse: Windows VM harness from the AccountPane HANDOFF (`prlctl exec`, `prlctl capture`, `scratchpad/win/vmkey.py`), test profile `C:\Users\mike\TB-AccountPane-Test\profile`.

**Interfaces:**
- Produces: a yes/no answer for (a) stylesheet applied inside `about:3pane` and `about:message`, (b) `dark_theme` colours active when Windows is in dark mode and `theme` colours when light. Nothing else depends on the spike files.

- [ ] **Step 1: Write the spike manifest**

`manifest_version` 2, id `tangaroa-spike@stupalov.github.io`, version `0.0.1`, `theme.colors` = `{ "frame": "#E2E7EE", "toolbar": "#C5D0DD", "toolbar_text": "#1E2D3F", "sidebar": "#1E2D3F", "sidebar_text": "#F9FAFC", "tg_bg_primary": "#F9FAFC", "tg_bg_sidebar": "#1E2D3F" }`, `theme.properties` = `{ "color_scheme": "light" }`, `dark_theme.colors` = same keys with `frame` `#253649`, `toolbar` `#1A2838`, `toolbar_text` `#F9FAFC`, `sidebar` `#1E2D3F`, `sidebar_text` `#F9FAFC`, `tg_bg_primary` `#16222F`, `tg_bg_sidebar` `#1E2D3F`, `dark_theme.properties` = `{ "color_scheme": "dark" }`, `theme_experiment` = `{ "stylesheet": "spike.css", "colors": { "tg_bg_primary": "--tg-bg-primary", "tg_bg_sidebar": "--tg-bg-sidebar" } }`.

- [ ] **Step 2: Write `spike.css`**

`:root { --tg-bg-primary: magenta; --tg-bg-sidebar: magenta; }` (defaults that must be overridden by the manifest), `#folderPane, #folderTree { background: var(--tg-bg-sidebar) !important; }`, `#threadTree, #threadPane { background: var(--tg-bg-primary) !important; }`, `#messageHeader { outline: 3px solid var(--tg-bg-sidebar) !important; }`.

- [ ] **Step 3: Pack and install in the Windows VM**

Zip the two files as `tangaroa-spike.xpi` (Python `zipfile`), copy to `C:\ProgramData\TBTest\`, start Thunderbird by the desktop shortcut, open the Add-ons Manager (Alt+T, Down, Down, Enter), reach the gear button by keyboard (Tab ×4 to the search field, Tab, Tab), Enter, choose "Install Add-on From File…", type the path, Enter, confirm "Add". Capture `spike-01-installed.png`.

- [ ] **Step 4: Verify (a) stylesheet reaches about:3pane and about:message**

Expected in the capture: folder pane `#1E2D3F`-ish (not magenta), thread list `#F9FAFC`; after opening a message (F6, N), the header has a visible outline. Magenta anywhere means the manifest→variable mapping failed; no change at all means the stylesheet did not reach the document. Record the result in `docs/testing.md` later (Task 5).

- [ ] **Step 5: Verify (b) dark_theme switching**

Switch Windows to dark mode from the host as SYSTEM: `reg add "HKU\<mike SID>\Software\Microsoft\Windows\CurrentVersion\Themes\Personalize" /v AppsUseLightTheme /t REG_DWORD /d 0 /f` (SID from `wmic useraccount where name='mike' get sid`), wait 5 s, capture `spike-02-dark.png`; expected thread list `#16222F`, toolbar `#1A2838`. Switch back with `/d 1`, capture `spike-03-light.png`; expected light values again.

- [ ] **Step 6: Gate**

If (a) or (b) fails: stop, report captures to the user, do not continue to Task 2 (user decision per spec). If both pass: remove the spike theme from the test profile (Add-ons Manager → Themes → spike → Remove, by keyboard) or leave it disabled; note the result for Task 5.

### Task 2: Theme skeleton, manifest and manifest tests

**Files:**
- Create: `theme/manifest.json`, `package.json`, `tests/manifest.test.mjs`, `tests/helpers.mjs`
- Delete: `chrome/` (whole tree), `settings/user.js`

**Interfaces:**
- Produces: `readManifest()` → parsed `theme/manifest.json`; `readStylesheet()` → `theme/tangaroa.css` text (both exported from `tests/helpers.mjs`, resolving paths relative to the repo root). Manifest key sets used by Tasks 3–4: `theme.colors` keys = standard keys `frame, frame_inactive, toolbar, toolbar_text, toolbar_field, toolbar_field_text, toolbar_field_border, toolbar_field_focus, toolbar_field_text_focus, toolbar_field_border_focus, toolbar_top_separator, toolbar_bottom_separator, toolbar_vertical_separator, tab_selected, tab_background_text, tab_text, tab_line, icons, icons_attention, button_background_hover, button_background_active, popup, popup_text, popup_border, popup_highlight, popup_highlight_text, sidebar, sidebar_border, sidebar_text, sidebar_highlight, sidebar_highlight_text, sidebar_highlight_border` plus custom keys `tg_bg_primary, tg_bg_secondary, tg_bg_sidebar, tg_toolbar_top, tg_toolbar_bottom, tg_tab_active, tg_tab_inactive, tg_divider_dark, tg_divider_light, tg_selector, tg_selector_sidebar, tg_selector_inactive, tg_selector_sidebar_inactive, tg_selector_thread_inactive, tg_font_primary, tg_font_secondary, tg_font_primary_sidebar, tg_font_secondary_sidebar, tg_font_primary_selected, tg_font_secondary_selected, tg_font_pending, tg_text_field_bg, tg_text_field_border, tg_folder_bubble_bg, tg_folder_bubble_text, tg_unread_dot, tg_icon_get, tg_icon_compose, tg_icon_reply, tg_icon_archive, tg_icon_delete, tg_icon_junk, tg_icon_tag`. Each `tg_<name>` maps to `--tg-<name with - instead of _>`.

- [ ] **Step 1: Write the failing manifest tests**

```js
// tests/manifest.test.mjs
test("manifest is a static theme for Thunderbird 157+", () => {
  const m = readManifest();
  assert.deepEqual(Object.keys(m).sort(), ["browser_specific_settings","dark_theme","description","icons","manifest_version","name","theme","theme_experiment","version"]);
  assert.equal(m.manifest_version, 2); assert.equal(m.version, "0.2.0"); assert.equal(m.name, "Tangaroa");
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test tests/manifest.test.mjs` Expected: FAIL (manifest missing).

- [ ] **Step 3: Write `theme/manifest.json`, `package.json`, `tests/helpers.mjs`**

Manifest per Interfaces; standard colour keys filled from the same palette (light: `frame` `#E2E7EE`, `toolbar` `#C5D0DD`, `toolbar_text` `#1E2D3F`, `toolbar_field` `#FFFFFF`, `toolbar_field_border` `#DFE3E7`, `tab_selected` `#CBD4E0`, `popup` `#F9FAFC`, `popup_text` `#1E2D3F`, `popup_highlight` `#55ADF8`, `sidebar` `#1E2D3F`, `sidebar_text` `#F9FAFC`, `sidebar_highlight` `#55ADF8`, `icons` `#5E6C79`, `icons_attention` `#dd491a`; dark: from the spec table, `popup` `#1A2838`, `popup_text` `rgba(255,255,255,0.95)`, `toolbar_field` `rgba(255,255,255,0.10)`). `package.json` like AccountPane's with `"test": "node --test tests/*.test.mjs"`, `"build": "python3 scripts/build.py"`, version `0.2.0`. `git rm -r chrome settings`.

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test tests/manifest.test.mjs` Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add theme/manifest.json package.json tests/ && git rm -r -q chrome settings
git commit -m "Theme: static theme manifest with light and dark Tangaroa palettes"
```

### Task 3: Icon

**Files:**
- Create: `theme/icons/tangaroa.svg`, `theme/icons/tangaroa-32.png`, `-48.png`, `-64.png`, `scripts/render-icons.mjs`
- Test: `tests/manifest.test.mjs` (add one test)

**Interfaces:**
- Produces: the three PNG paths named in the manifest `icons` block.

- [ ] **Step 1: Add the failing test**

```js
test("icon files referenced by the manifest exist and are PNG", () => {
  for (const file of Object.values(readManifest().icons)) {
    const bytes = readFileSync(new URL("../theme/" + file, import.meta.url));
    assert.deepEqual([...bytes.subarray(0, 4)], [0x89, 0x50, 0x4e, 0x47]);
  }
});
```

- [ ] **Step 2: Run it** Expected: FAIL (ENOENT).

- [ ] **Step 3: Draw `tangaroa.svg` and render**

64×64 viewBox: a rounded square split horizontally, top `#E2E7EE`→`#C5D0DD` toolbar band, left third `#1E2D3F` sidebar with one `#dd491a` badge dot, right area `#F9FAFC` with two `#D2D8E6` row lines and one `#55ADF8` selected row. `scripts/render-icons.mjs` = AccountPane's script with sizes `[32, 48, 64]` and paths under `theme/icons`; run it with `NODE_PATH=/Volumes/Code/GitHub/thunderbird-account-pane/node_modules` (sharp lives there) and note that in `docs/development.md` (Task 5).

- [ ] **Step 4: Run tests** Expected: PASS.

- [ ] **Step 5: Commit** `git add theme/icons scripts/render-icons.mjs tests/manifest.test.mjs && git commit -m "Theme: Tangaroa icon"`

### Task 4: tangaroa.css port and stylesheet tests

**Files:**
- Create: `theme/tangaroa.css`
- Test: `tests/stylesheet.test.mjs`
- Reference (read only, from git history `v0.1.0`): `chrome/postbird/config.css`, `chrome/postbird/components/*.css`

**Interfaces:**
- Consumes: variable names from Task 2 (`--tg-*`), AccountPane's variables (`--sidebar-background`, `--sidebar-color`, `--sidebar-border`, `--treeitem-background-active`, `--treeitem-background-hover`, `--treeitem-text-active`, `--list-container-background-*`, `--list-container-border-*`, `--folderpane-unread-count-background`, `--folderpane-unread-count-text`, `--folderpane-total-count-background`, `--folderpane-total-count-text`, `--folder-color-folder`, `--list-item-min-height`).
- Produces: one stylesheet, sections in this order: `:root` defaults for every `--tg-*` (light values, so a missing mapping degrades gracefully) and size tokens (`--tg-ui-font-size: 13px`, `--tg-list-font-size: 13px`, `--tg-list-header-size: 11px`, `--tg-folder-section-size: 11px`, `--tg-folder-name-size: 13px`, `--tg-message-header-size: 12px`, `--tg-message-subject-size: 18px`, `--tg-toolbar-label-size: 11px`, `--tg-folder-badge-radius: 4px`, `--tg-folder-badge-size: 11px`, `--tg-font-family: system-ui, -apple-system, "Segoe UI", sans-serif`); typography; toolbar; tabs; spaces; folder pane; thread pane table; thread pane cards; message header and pane; quick filter; status bar.

- [ ] **Step 1: Write the failing stylesheet tests**

```js
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
```

- [ ] **Step 2: Run** `node --test tests/stylesheet.test.mjs` Expected: FAIL (file missing).

- [ ] **Step 3: Write `theme/tangaroa.css`**

Port each 0.1.0 component with `--pb-` → `--tg-` renames, drop `@-moz-document`, keep `!important`. New rules the kit did not have: cards (`#threadTree tbody > tr.card-layout` background `--tg-bg-primary`, `.card-container` border `--tg-divider-light`, selected/focused the same pair as table rows, subject/sender colours `--tg-font-primary`/`--tg-font-secondary`), message header text colours (`#messageHeader`, `.message-header-label`, `.header-recipient`, `#expandedsubjectBox`, date → `--tg-font-primary`/`--tg-font-secondary` so the dark variant is readable), quick filter bar, `#messagepanebox`. The `--list-item-min-height` override from 0.1.0 is dropped.

- [ ] **Step 4: Run** all tests Expected: PASS.

- [ ] **Step 5: Commit** `git add theme/tangaroa.css tests/stylesheet.test.mjs && git commit -m "Theme: port the Tangaroa stylesheet to theme_experiment"`

### Task 5: Build script, build tests, reference palettes and docs

**Files:**
- Create: `scripts/build.py`, `tests/build.test.mjs`, `docs/reference/postbox-palettes.json`, `docs/development.md`, `docs/testing.md`
- Modify: `README.md`, `README.ru.md`, `CHANGELOG.md`, `ATTRIBUTION.md`, `.gitignore` (keep `dist/`)

**Interfaces:**
- Consumes: Task 2 manifest, Task 3 icons, Task 4 stylesheet.
- Produces: `dist/tangaroa-0.2.0.xpi`; `ALLOWED_FILES = ("manifest.json", "tangaroa.css", "icons/tangaroa-32.png", "icons/tangaroa-48.png", "icons/tangaroa-64.png", "LICENSE-Postbird")` where `theme/LICENSE-Postbird` is the MIT text of Postbird (moved from `chrome/postbird/LICENSE` in history).

- [ ] **Step 1: Write the failing build tests** (fixture pattern copied from AccountPane's `tests/build.test.mjs`, adjusted paths `theme/`): archive lists exactly the six allowlisted files sorted, extra files in `theme/` are not packed, manifest in the archive has version `0.2.0` and id `tangaroa@stupalov.github.io`, two builds are byte-identical, and `strict_min_version` is `"157.0"` with `strict_max_version` `"*"`.
- [ ] **Step 2: Run** `node --test tests/build.test.mjs` Expected: FAIL.
- [ ] **Step 3: Write `scripts/build.py`** — AccountPane's script trimmed: `ALLOWED_FILES` above, manifest key-set check (`Global Constraints`), version `0.2.0`, output `dist/tangaroa-0.2.0.xpi`, fixed timestamps, error token `TANGAROA_BUILD_INVALID_INPUT`.
- [ ] **Step 4: Run** all tests, then `python3 scripts/build.py` twice; Expected: PASS and identical SHA-256.
- [ ] **Step 5: Write docs** — `docs/reference/postbox-palettes.json`: `{ "source": "Postbox 7 theme export, variable names and values only", "tangaroa": {...}, "midnight": {...} }` with the variables from `Tangaroa.json` and `Midnight.json`. README (EN, then RU translation): install from Releases via Add-ons and Themes → gear → Install Add-on From File…, appears under Themes; light/dark follows the system; a "Migrating from the 0.1 kit" section telling users to remove `chrome/userChrome.css`, `chrome/userContent.css` and `user.js` from the profile; an "Optional view settings" note that Table View, density and Classic layout are standard Thunderbird choices and not required. CHANGELOG `0.2.0`. `docs/development.md`: build, test, icon rendering (`NODE_PATH` note), spike results. `docs/testing.md`: journal starting with the Task 1 spike captures (fictional data only).
- [ ] **Step 6: Commit** `git add -A && git commit -m "Theme: reproducible build, docs and reference palettes for 0.2.0"`

### Task 6: Native check on Windows, light mode, with AccountPane

**Files:**
- Modify: `docs/testing.md`
- Harness: AccountPane HANDOFF Windows section; captures saved under `dist/windows-<date>/` (not in Git).

- [ ] **Step 1: Prepare the profile** — remove the 0.1 kit from the test profile (`chrome\`, `user.js`) as SYSTEM; Thunderbird closed.
- [ ] **Step 2: Install `dist/tangaroa-0.2.0.xpi`** by the keyboard path from Task 1 Step 3; Windows in light mode.
- [ ] **Step 3: Capture and compare** — `01-light-main.png` (table view), switch to card view via the list display menu (Tab from thread pane header, Enter, choose Cards) → `02-light-cards.png`, open a message → `03-light-message.png`, collapse All Accounts → `04-light-accountpane.png`. Compare with the Postbox Tangaroa reference capture: sidebar colour, badges, selection colour, toolbar gradient, header readability.
- [ ] **Step 4: Fix** any mismatch in `tangaroa.css` or the manifest, rebuild, reinstall over the same id, re-capture. Add a regression test only when a mismatch came from a missing rule class (e.g. cards).
- [ ] **Step 5: Record** results in `docs/testing.md` and commit: `git commit -am "Theme: Windows light-mode check"`

### Task 7: Native check on Windows, dark mode, and dark palette tuning

**Files:**
- Modify: `theme/manifest.json` (dark colours), `theme/tangaroa.css`, `docs/testing.md`

- [ ] **Step 1: Switch Windows to dark mode** (registry command from Task 1 Step 5); confirm Thunderbird swapped to `dark_theme` without restart; capture `05-dark-main.png`, `06-dark-cards.png`, `07-dark-message.png` (header, labels, body frame), `08-dark-context-menu.png` (Shift+F10 on an account), `09-dark-search.png` (Ctrl+K with text typed).
- [ ] **Step 2: Compare** with the Postbox Midnight reference: roles (which surface is lighter), Tangaroa key colours retained, text contrast ≥ 4.5:1 (check hex pairs with a small Python contrast function in the scratchpad). Tune the dark table values in the manifest; keep the tests in Task 2 Step 1 true (key colours fixed, `tg_bg_primary` `#16222F` may change only if the test is updated in the same commit with the reason).
- [ ] **Step 3: Verify no manual settings are needed** — the profile has no `user.js`; the capture set is taken at default `mail.uidensity`, default list view and default font size.
- [ ] **Step 4: Switch Windows back to light mode**, confirm the light variant returns; record both in `docs/testing.md`; commit: `git commit -am "Theme: dark variant tuned on Windows"`

### Task 8: macOS check and release candidate

**Files:**
- Modify: `docs/testing.md`, `README.md`, `README.ru.md`, `build/HANDOFF.md` (AccountPane checkout, not in Git)

- [ ] **Step 1: macOS install** — the user's working profile is the only macOS Thunderbird; hand the XPI path to the user to install themselves (Add-ons and Themes → gear → Install Add-on From File…) and to remove the 0.1 kit files from the profile after quitting Thunderbird; ask them to switch macOS appearance once. Do not drive the working profile from automation.
- [ ] **Step 2: Collect** the user's feedback and, if they share screenshots, compare with Postbox; fix and rebuild as needed.
- [ ] **Step 3: Record** in `docs/testing.md` which platforms and modes were observed; update README "checked with" lines accordingly (macOS 158 and Windows 11 158, both modes), nothing more.
- [ ] **Step 4: Tag and release** only on the user's explicit go-ahead: `git tag -a v0.2.0`, `gh release create v0.2.0 dist/tangaroa-0.2.0.xpi --prerelease` with notes (what's new, install, SHA-256, limits). Repository stays private.
