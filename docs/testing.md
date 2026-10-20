# Testing journal

Checks use fictional profiles only; no real mail data is recorded here.

## 0.2.0 spike (2026-10-20, Thunderbird 158.0, Windows 11 VM, fictional profile)

- The `theme_experiment` stylesheet is applied inside `about:3pane` and `about:message`: sampled folder pane #1E2D3F, list #F9FAFC, no fallback colour visible.
- `dark_theme` switches live with the Windows colour scheme without a restart: toolbar #C5D0DD / #1A2838, list #F9FAFC / #16222F.

Notes:

- The `frame` colour did not show at the window top.
- An `outline` on `#messageHeader` was clipped.

## 0.2.0 native checks

Checks use fictional profiles only; no real mail data is recorded here.

### Windows 11, light mode

Thunderbird 158.0, Windows light mode, `tangaroa-0.2.0.xpi`, Thunderbird defaults, AccountPane 0.1.9 active. Captures are kept outside Git.

How this check was run:

- Profile prep: `chrome` renamed to `chrome.off`, `user.js` removed, kit prefs (font, density, list view, pane config, button style, legacy stylesheets, active theme id) removed from `prefs.js`.
- Windows light mode confirmed (`AppsUseLightTheme` and `SystemUsesLightTheme` = 1).
- Install by keyboard: Tools, Add-ons and Themes, gear button, Install Add-on From File..., path, Alt+A to confirm, Alt+O on the "was added" notice. The theme was enabled immediately.
- Display-menu gotcha: in the message list display menu, pressing Up from nothing wraps to "Hide Message List Header". It was hidden by mistake once and restored via View, Layout.

Results:

- Matches the Postbox Tangaroa reference: navy sidebar (#1E2D3F), orange unread badge, light list, light message header (readable), blue tab line, cards and table views both themed.
- Selection: a focused selection is the Tangaroa `#55ADF8` (Postbox's own `--selector`) with light text. The reference image shows unfocused (muted) selections; unfocused selections in the captures are pale blue-grey like the reference. The difference is focus state, not a theme defect.
- Table view (`02b`, `02c`): at the default narrow pane width the columns are truncated ("Sub", "Corr..."); this is pane width, not the theme.
- Quick filter bar (`05-light-quickfilter-table.png`): the bar opens with the filter field and button themed in the light palette; nothing beyond that was checked.
- AccountPane list renders correctly with All Accounts collapsed and expanded (`04-light-accountpane.png`).

Known differences (structural, not theme):

- The test profile shows no labelled unified toolbar (only the search row), so the toolbar gradient and button labels were not compared.
- Thunderbird has no Postbox attributes/favorites column.

Not covered: hover states, dark mode (Task 7).

Pending (Tasks 7-8).
