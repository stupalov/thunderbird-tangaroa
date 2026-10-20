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

Thunderbird 158.0, Windows light mode, `tangaroa-0.2.0.xpi` installed through Add-ons Manager, Thunderbird defaults (old 0.1 kit and font/density prefs removed), AccountPane 0.1.9 active. Captures are kept outside Git.

- Default view after install is the cards view. Navy sidebar (#1E2D3F), orange unread badge, bright blue current-account row and focused card/row selection, light blue-grey toolbar/tab strip, light list and message pane: all match the Postbox Tangaroa reference.
- An unfocused selected card/row is pale blue-grey, as in the reference; a focused one is blue with light text.
- Table view, cards view, message pane header (sender, subject, action buttons readable), message tab (blue tab line), quick filter bar, status bar and the AccountPane list with All Accounts collapsed and expanded all render correctly.
- Fixes needed: none.
- Not covered: hover states, the labelled unified toolbar (not shown by this profile's default toolbar), dark mode (Task 7).

Pending (Tasks 7–8).
