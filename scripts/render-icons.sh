#!/usr/bin/env bash
# Renders theme/icons/tangaroa.svg to the PNG sizes named in theme/manifest.json.
# macOS-only (uses swift/AppKit and sips). The PNGs are committed, so builds do
# not depend on this script; rerun it only after changing the SVG.
# (qlmanage was tried first but paints an opaque white background and does not
# scale the SVG, so AppKit renders into a transparent bitmap instead.)
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
svg="$root/theme/icons/tangaroa.svg"
for size in 32 48 64; do
  out="$root/theme/icons/tangaroa-$size.png"
  swift "$root/scripts/render-icon.swift" "$svg" "$out" "$size"
  w="$(sips -g pixelWidth "$out" | awk '/pixelWidth/{print $2}')"
  [ "$w" = "$size" ] || { echo "unexpected width $w for $out" >&2; exit 1; }
  echo "wrote $out (${size}x${size})"
done
