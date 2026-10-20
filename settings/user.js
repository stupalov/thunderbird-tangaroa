// Thunderbird Tangaroa (macOS): appearance preferences only.
// Copy to the ACTIVE PROFILE root while Thunderbird is closed.
// After the first successful start, quit and rename to user.js.applied.
// Leaving user.js in place reapplies these preferences on every startup.
// No accounts, passwords, servers or extension settings are included.

user_pref("toolkit.legacyUserProfileCustomizations.stylesheets", true);
user_pref("mail.uifontsize", 15);
user_pref("mail.uidensity", 1);
user_pref("mail.pane_config.dynamic", 0);
user_pref("mail.threadpane.listview", 1);
user_pref("toolbar.unifiedtoolbar.buttonstyle", 1);
user_pref("font.default.x-western", "sans-serif");
user_pref("font.name.serif.x-western", "Verdana");
user_pref("font.name.sans-serif.x-western", "Menlo");
user_pref("font.name.monospace.x-western", "Menlo");
user_pref("font.size.variable.x-western", 13);
user_pref("font.size.monospace.x-western", 13);
user_pref("font.default.x-cyrillic", "sans-serif");
user_pref("font.name.serif.x-cyrillic", "Verdana");
user_pref("font.name.sans-serif.x-cyrillic", "Menlo");
user_pref("font.name.monospace.x-cyrillic", "Menlo");
user_pref("font.size.variable.x-cyrillic", 12);
user_pref("font.size.monospace.x-cyrillic", 12);
