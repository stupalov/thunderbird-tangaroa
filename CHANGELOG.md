# Changelog

User-facing changes, newest first.

## 0.2.3

- Set `strict_max_version` to `158.*`: the add-on catalogue requires an explicit maximum for theme experiments. Each new Thunderbird release will need a theme update (or a compatibility edit in the catalogue).

## 0.2.2

- Remove the explicit `strict_max_version` from the manifest (the catalogue validator rejects `*`); superseded by 0.2.3.

## 0.2.1

- Add a preview image for the Themes list of the Add-ons Manager.

## 0.2.0

- The kit becomes an installable static Thunderbird theme with a `theme_experiment` stylesheet; install it from an `.xpi` file instead of copying files into the profile.
- Adds a dark variant based on Postbox Midnight with Tangaroa's key colours.
- The theme follows the system colour scheme.
- No manual profile settings are needed: `user.js`, `userChrome.css` and `userContent.css` are no longer used.
- Known limitation: the body of an open message in the dark variant keeps Thunderbird's dark-reader grey; message content cannot be themed.
- Migration: delete `chrome/userChrome.css`, `chrome/userContent.css`, `chrome/postbird/`, `user.js` and `user.js.applied` from the profile before installing the theme. Deleting the files does not undo the preferences the 0.1 `user.js` saved into `prefs.js` (UI font size and density, list view, pane layout, toolbar button style, legacy stylesheets, font families and sizes); they are harmless and can be reset in the Config Editor.

## 0.1.0

- First release of the Thunderbird Tangaroa kit: Postbox-like Tangaroa appearance for Thunderbird on macOS, adapted from Postbird.
- Checked with Thunderbird 157.0.1 and 158.0 on macOS 27 (Apple Silicon).
- Repository renamed from postbird-tangaroa to thunderbird-tangaroa; README available in English and Russian.
