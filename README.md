# Tangaroa for Thunderbird

**English** · [Русский](README.ru.md)

A Thunderbird theme that comes close to Postbox with its Tangaroa theme: a dark blue folder pane, a light message list and reading area, and the system font. It was made after Postbox stopped being updated, to keep the familiar look of mail in Thunderbird. The styles are an adaptation of [Postbird](https://github.com/Ocanamat/Postbird) with the Tangaroa palette.

The Postbox-style account list above the folder tree comes from a separate extension, [AccountPane](https://github.com/stupalov/thunderbird-account-pane). The theme and the extension are independent and can be used together.

## What you get

- The light Tangaroa look and a dark variant based on Postbox Midnight with Tangaroa's key colours. The variant switches with the system colour scheme.
- It works in both the table view and the card view of the message list.
- It styles the main window: toolbar, tabs, folder pane (including AccountPane rows), message list, message header and status bar.

## Installation

1. Download `tangaroa-<version>.xpi` from the [Releases](https://github.com/stupalov/thunderbird-tangaroa/releases) page.
2. In Thunderbird open **Add-ons and Themes**, click the gear button and choose **Install Add-on From File…**.
3. Select the downloaded file and confirm the installation.

The theme appears under **Themes** and is enabled. To switch back, choose another theme in the same place. Thunderbird 157 or newer is required.

## Light and dark

The theme follows the system colour scheme. Thunderbird's own theme overrides are not supported, and the theme has no settings of its own.

## Optional view settings

Table View, density and Classic layout are standard Thunderbird choices. They are not required, and the theme works with the defaults.

## Migrating from the 0.1 kit

Version 0.1 was a set of files copied into the profile. To move to the theme:

1. Quit Thunderbird completely.
2. In the profile delete `chrome/userChrome.css`, `chrome/userContent.css`, the `chrome/postbird/` folder, and `user.js` and `user.js.applied` if they exist.
3. Start Thunderbird and install the theme as described above.

## Status

Beta. Checked so far: see [docs/testing.md](docs/testing.md).

## Development

See [docs/development.md](docs/development.md).

## More information

[Changelog](CHANGELOG.md) · [Attribution](ATTRIBUTION.md) · [License](LICENSE)

Tangaroa for Thunderbird is an independent project, not an official Thunderbird or Postbox product.
