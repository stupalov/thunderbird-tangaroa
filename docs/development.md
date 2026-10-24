# Development

## Layout

- `theme/` — everything that can go into the theme file: `manifest.json`, `preview.png`, `tangaroa.css`, `icons/`, `LICENSE-Postbird`.
- `scripts/` — `build.py` (packaging) and `render-icons.sh` with `render-icon.swift` (icon rendering).
- `tests/` — Node tests for the manifest, the stylesheet and the build.
- `docs/` — this file, `testing.md` (check journal) and `reference/postbox-palettes.json` (Postbox palettes, names and values only).

## Build

```sh
python3 scripts/build.py
```

The result is `dist/tangaroa-0.2.4.xpi`, and the script prints its SHA-256. The build packs only the files in `ALLOWED_FILES`, validates the manifest, uses fixed timestamps and is reproducible: two builds give identical bytes. The SHA-256 is reproducible on one machine (it depends on the zlib/Python build), so the release hash is taken from the release build. On invalid input it fails with `TANGAROA_BUILD_INVALID_INPUT`. `dist/` is ignored by Git.

## Tests

```sh
node --test tests/*.test.mjs
```

The directory form `node --test tests/` does not work.

## Icons

`scripts/render-icons.sh` renders `theme/icons/tangaroa.svg` into the 32, 48 and 64 px PNGs and `theme/preview.svg` into `theme/preview.png` (680×92, the card header in the Themes list; Thunderbird picks up `preview.png` from the XPI root). It needs macOS (it uses `render-icon.swift`). The PNGs are committed, so other systems do not need to run it.

## How colours reach the stylesheet

The manifest keeps the standard Thunderbird colours and, in addition, custom `tg_*` keys under `theme.colors` and `dark_theme.colors`. The `theme_experiment` block maps each `tg_*` key to a CSS variable (for example `tg_bg_primary` becomes `--tg-bg-primary`) and names `tangaroa.css`. Thunderbird sets those variables on the window from the active (light or dark) colours, and the stylesheet uses them. The `:root` defaults in the stylesheet equal the light colours; a test checks this.

## Version bump checklist

1. `theme/manifest.json` (`version`)
2. `package.json` (`version`)
3. `scripts/build.py` (version check and output name; the version appears in two places)
4. `tests/build.test.mjs` (output name and expected version)
5. `tests/manifest.test.mjs`
6. `CHANGELOG.md`
