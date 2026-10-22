# Testing journal

Checks use fictional profiles only; no real mail data is recorded here.

## 0.2.0 spike (2026-10-20, Thunderbird 158.0, Windows 11 VM, fictional profile)

- The `theme_experiment` stylesheet is applied inside `about:3pane` and `about:message`: sampled folder pane #1E2D3F, list #F9FAFC, no fallback colour visible.
- `dark_theme` switches live with the Windows colour scheme without a restart: toolbar #C5D0DD / #1A2838, list #F9FAFC / #16222F.

Notes:

- The `frame` colour did not show at the window top.
- An `outline` on `#messageHeader` was clipped.

## 0.2.0 native checks

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

### Windows 11, dark mode

Thunderbird 158.0, Windows dark mode, `tangaroa-0.2.0.xpi`, AccountPane 0.1.9 active, same profile as the light check. Captures (`05`-`15`) are kept outside Git.

How this check was run:

- Dark mode switched live: `AppsUseLightTheme` and `SystemUsesLightTheme` = 0 under the user's `Personalize` key. Thunderbird swapped from `theme` to `dark_theme` within seconds, without a restart.
- No manual settings: the profile has no `user.js` and no `chrome` folder; `prefs.js` has no density, font size, list view or colour-scheme prefs. The only theme prefs are `extensions.activeThemeID` and `browser.theme.content-theme`/`toolbar-theme`, which Thunderbird writes itself when the theme changes. Captures use the default density, font size and cards view.
- Reinstall gotcha: reinstalling the XPI with the same id updates the manifest colours live, but the `theme_experiment` stylesheet stays cached until Thunderbird restarts. After a CSS change, restart Thunderbird before taking captures.
- Pixel colours were read from the captures; contrast is WCAG 2 with rgba text composited over its background.

Matches the Postbox Midnight roles:

- Every neutral surface is Tangaroa navy (hue 211-214°): toolbar gradient `#253649` to `#1A2838` (lightest), sidebar `#1E2D3F`, message header, thread header, status bar and menus `#1A2838`, list `#16222F` (darkest), inactive tabs `#172330`, selected tab `#1E2D3F`.
- Key colours are unchanged: focused selection `#55ADF8`, orange badge `#dd491a`, sidebar `#1E2D3F`, list `#16222F`.
- Unfocused selections use Midnight's alphas: list `rgba(255,255,255,0.2)`, which shows as `#454F59`, the muted blue-grey from the reference; sidebar 0.1.
- Text uses Midnight's alphas: primary 0.95 white, secondary 0.7 white.

Contrast (text on its own background):

| Pair | Ratio |
| --- | --- |
| List text / `#16222F` | 14.6 |
| List secondary (sender, date) / `#16222F` | 8.5 |
| Unfocused selected card, primary / secondary | 7.8 / 5.1 |
| Thread header, message header labels, status bar / `#1A2838` | 8.0 |
| Message header text / `#1A2838` | 13.6 |
| Sidebar text / secondary on `#1E2D3F` | 13.4 / 7.6 |
| Toolbar text / `#253649` | 11.3 |
| Search field / focused search field | 8.4 / 7.5 |
| Tab text, inactive / selected | 14.5 / 12.8 |
| Menu and popup text / `#1A2838`; hovered item | 13.6 / 7.9 |
| Hovered list row | 8.5 |
| Focused selection, white / `#55ADF8` (key colour) | 2.4 |
| Badge, white / `#dd491a` (key colour) | 4.2 |

Changes made (dark palette, plus two stylesheet fixes):

- `tg_font_secondary`, `tg_font_secondary_sidebar`, `tab_background_text`, `icons`: `#8494A3` to `rgba(255,255,255,0.7)`. `#8494A3` measured 4.1 on an unfocused selected card, 4.5 on the sidebar and 4.0 on the frame; the Midnight alpha gives 5.1-8.5.
- `tg_selector_thread_inactive`: 0.08 to 0.2. At 0.08 an unfocused selected card was hard to tell from the list. `tg_selector_inactive` and `tg_selector_sidebar_inactive`: 0.12 to 0.1 (Midnight values).
- `toolbar_field` / `toolbar_field_focus`: `rgba(255,255,255,0.10/0.16)` to the opaque `#3B4A5B` / `#485666`, which are the same alphas pre-composited over the toolbar. Thunderbird raises a focused-field colour below 0.9 opacity to 0.9 and switches the text to black, so with the old values the focused global search field turned light grey (`#EAEBED`) with black text.
- Stylesheet, dark variant only: context menus ignore the theme's `popup` colours (toolkit `popup.css` sets `--panel-background-color: Menu` on non-arrow menupopups), so they were system grey `#222222`. They now use `--tg-bg-secondary` with `--tg-hover` for the hovered item. The light variant keeps the native menu (`#EDEDED`, checked in `13`).
- Stylesheet, both variants: the tab rules matched `[selected="true"]`, but Thunderbird sets a valueless `selected` attribute. Every tab, including the selected one, got the inactive colour. The rules now match `[selected]`: in dark mode the selected tab is `#1E2D3F` on `#172330`, in light mode `#CBD4E0` on `#B9C5D2` (checked in `14`).

Known differences:

- The message body is Thunderbird's native dark reader (`#18181B` for plain text; `#27272A` with no message selected), not navy. Theme stylesheets do not reach the content document. In the Midnight reference the body is white because that message is HTML.
- White text on the `#55ADF8` focused selection is 2.4:1, and white on the `#dd491a` badge is 4.2:1. Both are Tangaroa key colours, the same in the light variant and in Postbox; they were kept as the spec requires. Unfocused selections meet 4.5:1.
- The Spam folder icon (`--tg-icon-junk` `#55ADF8`) disappears on the focused `#55ADF8` folder selection. This happens in both variants.
- The page contents of the Add-ons Manager are native dark grey (a content page).

Not covered: table view in dark mode, the quick filter bar, compose and address book windows, hover states other than menu items.

Back to light mode: setting both values to 1 restored the light variant live (`12`); list `#F9FAFC`, sidebar `#1E2D3F`, message header `#E5E9F2`, search field `#FFFFFF`.

Pending (Task 8).

### macOS 27, light and dark (user check)

Thunderbird 158.0, the user's working profile with AccountPane 0.1.9, `tangaroa-0.2.0.xpi` installed through Add-ons and Themes, 2026-10-22. The 0.1 kit was moved out of the profile (`chrome` folder renamed) and Thunderbird restarted once.

- Light system appearance: the theme reproduces the previous kit's look; no issues reported.
- Dark system appearance: the interface switches to the dark variant without a restart; no issues reported except the message body.
- Decision: the body of an open message is painted by Thunderbird's dark reader (`html { background: --color-gray-90 }` inside the message document, `#18181B`). A theme stylesheet does not reach message content, and a helper extension (`messageDisplayScripts`) was rejected as out of scope. Recorded as a known limitation in the README.
- Not covered: hover states, compose and address-book windows.

