# Thunderbird Tangaroa

**English** · [Русский](README.ru.md) · [Contents](#whats-included) · [Installation](#installation) · [Checks](#checking-the-result) · [Rollback](#rollback)

A Thunderbird appearance that comes close to Postbox with its Tangaroa theme: a single-line message list with columns, a dark folder pane, the system font and a light reading area. The kit was put together after Postbox stopped being updated, to keep the familiar look of mail in Thunderbird. It is an adaptation of the [Postbird](https://github.com/Ocanamat/Postbird) styles with the Tangaroa palette.

The Postbox-style account list above the folder tree comes from a separate extension, [AccountPane](https://github.com/stupalov/thunderbird-account-pane). The theme and the extension are independent and can be used together.

The kit is plain userChrome CSS and preferences, so it installs the same way on macOS, Windows and Linux. It has been checked with Thunderbird **157.0.1** and **158.0** on macOS 27 (Apple Silicon) and, in a quick check, with Thunderbird **158.0** on Windows 11 (see below). Linux has not been checked. The styles target Thunderbird's internal interface elements, so a major Thunderbird update may require adjustments.

## What's included

- `chrome/` — the stylesheets, ready to copy into a profile. The `chrome/postbird/` subfolder keeps the structure of the original Postbird.
- `settings/user.js` — appearance and font preferences for the first start.
- `LICENSE` — the MIT license of this kit; the Postbird license is kept in `chrome/postbird/LICENSE`.
- `ATTRIBUTION.md` — where the components come from and what was adapted.

The kit contains no mail accounts, addresses, passwords, messages, server settings or extensions. Favorite folders depend on your accounts and are set up by hand.

## Installation

Download the archive from the [Releases](https://github.com/stupalov/thunderbird-tangaroa/releases) page or via Code → Download ZIP, and unpack it.

### 1. Find the Thunderbird profile

Install Thunderbird from the [official site](https://www.thunderbird.net/) and start it at least once. Add your mail accounts the usual way.

In Thunderbird open **≡ → Help → Troubleshooting Information**. In the **Profile Folder** row click **Show in Finder** / **Open Folder** and leave that window open.

This is the active profile; its name differs on every computer. It usually lives in `~/Library/Thunderbird/Profiles/` on macOS, `%APPDATA%\Thunderbird\Profiles\` on Windows and `~/.thunderbird/` on Linux. Do not pick a profile just because its name looks similar, and do not copy anything into the application folder. [Mozilla's official guide](https://support.mozilla.org/en-US/kb/profiles-where-thunderbird-stores-user-data).

### 2. Quit Thunderbird and keep the original state

Quit the application completely: **Thunderbird → Quit Thunderbird** (**⌘Q**) on macOS, **≡ → Exit** on Windows and Linux. Closing a window is not enough.

On a fresh installation it is convenient to copy the whole profile folder and keep it apart from the kit, so the original settings can be restored. If the profile already has `chrome/` or `user.js`, set them aside. A profile with another theme needs a manual merge; the steps below assume a clean installation.

### 3. Copy the files

From the unpacked kit copy:

1. The whole **`chrome`** folder into the root of the active profile.
2. The file **`settings/user.js`** into the same profile root, named **`user.js`**.

The result should look like this:

```text
<active profile>/
├── prefs.js                 ← created by Thunderbird itself
├── user.js                  ← copied from settings/
└── chrome/
    ├── userChrome.css
    ├── userContent.css
    └── postbird/
        ├── config.css
        ├── components/
        ├── LICENSE
        └── README.md
```

There must be no `chrome/chrome/` and no `<profile>/settings/user.js`. File names must end in `.css` and `.js` without an extra `.txt`. If you save files by hand, use plain text, not RTF or a Word document.

### 4. First start

Start Thunderbird. Check the dark folder pane and the light list and reading areas.

To match the checked look, select the built-in **Light** theme: **≡ → Add-ons and Themes → Themes**.

After a successful start quit Thunderbird again and rename **`user.js` → `user.js.applied`** in the profile, then start the application. This applies the preferences once; the values are already saved in `prefs.js`. If `user.js` stays in place, it reapplies the values at every start and changes made in the interface are reverted.

### 5. Finish the pane layout

Some values are already applied by `user.js`. Pane widths, favorite folders, columns and the message header are set by hand:

- **View → Layout → Classic View**: folders on the left, message list top right, message below. If the message pane is hidden, show it (the standard key is **F8**).
- In the message list display menu next to the folder name choose **Table View** if the list still shows cards.
- Keep the **Default** density; `mail.uidensity = 1` in the kit sets it automatically.
- Drag the folder pane border to about **285 px** and adjust the list and message heights to your screen.
- In the folder pane modes enable **Favorite Folders** and **All Folders**. Add folders to favorites via their context menu.
- Columns as in the checked look: thread status, read, star, subject, correspondents, attachments, date, junk, size. Order them by dragging the headers; sort by date, newest first. The columns menu can apply them to other folders.
- Toolbar: icons with labels below. Main actions: get messages, write, reply, reply all, forward, tag, archive, delete, address book.
- Hide the Spaces toolbar and other bars via the **View** menu if you do not need them.

### 6. Header of an open message

Open a message and its header settings via **More → Customize**. For the checked look enable the regular-size avatar, the full sender address and the large subject; keep field labels visible and the button style default.

The styles set the header text to **12 px** and the subject to **18 px**. The body of an HTML message may carry its own sizes: the kit does not replace fonts and colors set by the sender.

## Text and row sizes

| Element | Setting |
|---|---|
| Message list | System font, 13 px |
| Folder and account names | System font, 13 px |
| Folder pane section labels and column headers | 11 px |
| Header of an open message | 12 px |
| Large message subject | 18 px |
| Main toolbar labels | 11 px |
| Message list row | 28 px |
| Base text size of the message area | 13 px, sizes inside HTML are kept |

`mail.uifontsize = 15` is needed for Thunderbird's own row height: at density 1 it computes `ceil(15 × 1.4) + 7 = 28 px`, while the styles set the visible text to 13 px separately. Do not replace 15 with 13. The virtual list height is not forced through CSS, so scrolling stays intact.

The interface font stack is the macOS system font with a generic sans-serif fallback, so other systems use their default sans-serif. For message text the kit sets: Latin 13 px, Cyrillic 12 px; monospace Menlo, serif Verdana, sans-serif Menlo (fonts that are missing on a system fall back to its defaults). These are the original personal choices rather than part of the Tangaroa palette; change them after the one-time application if you prefer something else.

## Installation without user.js

Instead of copying `settings/user.js`, open **≡ → Settings → General → Config Editor** ([how to open it](https://support.mozilla.org/en-US/kb/config-editor)) and set the values by hand. The minimum for the appearance and row height:

| Preference | Type | Value |
|---|---|---|
| `toolkit.legacyUserProfileCustomizations.stylesheets` | Boolean | `true` |
| `mail.uifontsize` | Number | `15` |
| `mail.uidensity` | Number | `1` |
| `mail.threadpane.listview` | Number | `1` |
| `mail.pane_config.dynamic` | Number | `0` |
| `toolbar.unifiedtoolbar.buttonstyle` | Number | `1` |

The font preferences are listed in full in `settings/user.js`. Restart Thunderbird after setting them by hand.

## Extensions

No extensions are required for this appearance. The Postbox-style split of the folder pane into an account list and the folders of the selected account is provided by [AccountPane](https://github.com/stupalov/thunderbird-account-pane); its rows and counters have been checked together with this theme.

## Windows notes

A quick check on Windows 11 (Thunderbird 158.0 x64 in a virtual machine, fictional accounts): the kit installs the same way and renders the dark folder pane, orange unread badges, the single-line table list, the light reading area and the toolbar gradient. The interface falls back to the Windows system font (Segoe UI). With Windows in dark mode and Thunderbird's default **System theme — auto**, the message header text is hard to read on the light header background, so select the built-in **Light** theme as step 4 says; the Light theme itself was not verified on Windows in that check. The message body area follows the selected Thunderbird theme.

## Checking the result

1. The message list shows rows with columns, not cards.
2. The folder pane is dark blue and unread counters are orange.
3. Open a familiar message and compare the subject, header and text size.
4. Scroll a long list down and back: rows render without gaps or overlaps.
5. If the density looks noticeably different, check the active profile name and the values 15 and 1.

## If the appearance does not show up

- Check that the open profile is the one the `chrome` folder was copied into.
- Check `toolkit.legacyUserProfileCustomizations.stylesheets = true`.
- Make sure the `chrome/postbird/components` subfolder is present.
- Check the file name extensions and restart Thunderbird completely.
- If only the row height differs, check the density and `mail.uifontsize`.
- After a Thunderbird update compare its version with the checked ones; internal element names may change.

## Changing the theme

The palette and main sizes live in **`chrome/postbird/config.css`**. Components are split by interface area: folders, list, toolbar, tabs, header, status bar. A full Thunderbird restart is needed after edits.

## Rollback

To disable only the appearance:

1. Quit Thunderbird.
2. Rename `chrome/userChrome.css` to `userChrome.css.disabled`.
3. Rename `chrome/userContent.css` to `userContent.css.disabled`.
4. Delete or rename the active `user.js` if it still exists.
5. Start Thunderbird.

Deleting `user.js` does not undo preferences that are already saved. To restore individual values, reset the preferences listed in the file via the Config Editor or restore your previous values from your own backup.

A full rollback to a profile copy is fine right after setting up a clean installation. If you have already received mail, saved drafts or changed accounts since the copy, restore only the appearance and preferences: restoring the old profile also returns its data to the moment of the copy.

## More information

[Changelog](CHANGELOG.md) · [Attribution](ATTRIBUTION.md) · [License](LICENSE)

Keep the repository in a separate folder outside the live Thunderbird profile; only the kit goes into Git, never profile backups. The original Postbird is credited in ATTRIBUTION.md and its license is kept. The kit uses its own CSS adaptation and palette values, without icons, font files or Postbox theme files. Thunderbird Tangaroa is an independent project, not an official Thunderbird or Postbox product.
