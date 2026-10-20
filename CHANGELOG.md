# Changelog

User-facing changes, newest first.

## 0.2.0

- The kit becomes an installable static Thunderbird theme with a `theme_experiment` stylesheet; install it from an `.xpi` file instead of copying files into the profile.
- Adds a dark variant based on Postbox Midnight with Tangaroa's key colours.
- The theme follows the system colour scheme.
- No manual profile settings are needed: `user.js`, `userChrome.css` and `userContent.css` are no longer used.
- Migration: delete `chrome/userChrome.css`, `chrome/userContent.css`, `chrome/postbird/`, `user.js` and `user.js.applied` from the profile before installing the theme.

## 0.1.0

- First release of the Thunderbird Tangaroa kit: Postbox-like Tangaroa appearance for Thunderbird on macOS, adapted from Postbird.
- Checked with Thunderbird 157.0.1 and 158.0 on macOS 27 (Apple Silicon).
- Repository renamed from postbird-tangaroa to thunderbird-tangaroa; README available in English and Russian.
