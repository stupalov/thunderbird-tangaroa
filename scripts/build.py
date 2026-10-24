#!/usr/bin/env python3
"""Build the Tangaroa theme from a fixed, reviewed set of inputs only."""
import hashlib
import json
from pathlib import Path
import sys
import tempfile
import zipfile

ALLOWED_FILES = (
    "manifest.json",
    "preview.png",
    "tangaroa.css",
    "icons/tangaroa-32.png",
    "icons/tangaroa-48.png",
    "icons/tangaroa-64.png",
    "LICENSE-Postbird",
)
MANIFEST_KEYS = {"manifest_version", "name", "description", "version",
                 "browser_specific_settings", "icons", "theme", "dark_theme",
                 "theme_experiment"}


def require(condition):
    if not condition:
        raise ValueError("TANGAROA_BUILD_INVALID_INPUT")


def unique_object(pairs):
    result = {}
    for key, value in pairs:
        require(key not in result)
        result[key] = value
    return result


def build(root):
    theme_root = root / "theme"
    require(theme_root.is_dir() and not theme_root.is_symlink())
    inputs = {}
    # Never scan theme/ or follow manifest references to discover files.
    for relative in ALLOWED_FILES:
        path = theme_root / relative
        for part in [path, *path.parents]:
            if part == root:
                break
            require(not part.is_symlink())
        require(path.is_file())
        inputs[relative] = path.read_bytes()
    manifest = json.loads(inputs["manifest.json"], object_pairs_hook=unique_object)
    require(set(manifest) == MANIFEST_KEYS)
    require(manifest["manifest_version"] == 2 and manifest["version"] == "0.2.1")
    require(manifest["browser_specific_settings"] == {"gecko": {
        "id": "tangaroa@stupalov.github.io",
        "strict_min_version": "157.0", "strict_max_version": "*"}})
    require(manifest["icons"] == {str(size): f"icons/tangaroa-{size}.png" for size in (32, 48, 64)})
    require(all(path in inputs for path in manifest["icons"].values()))
    require(isinstance(manifest["theme"], dict) and isinstance(manifest["dark_theme"], dict))
    experiment = manifest["theme_experiment"]
    require(isinstance(experiment, dict) and experiment.get("stylesheet") == "tangaroa.css")
    require(experiment["stylesheet"] in inputs)
    output_dir = root / "dist"
    require(not output_dir.is_symlink())
    output = output_dir / "tangaroa-0.2.1.xpi"
    require(not output.is_symlink())
    output_dir.mkdir(exist_ok=True)
    temporary = None
    try:
        with tempfile.NamedTemporaryFile(dir=output_dir, suffix=".xpi", delete=False) as handle:
            temporary = Path(handle.name)
        with zipfile.ZipFile(temporary, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
            for relative in sorted(ALLOWED_FILES):
                info = zipfile.ZipInfo(relative, date_time=(2026, 1, 1, 0, 0, 0))
                info.create_system = 3
                info.external_attr = 0o100644 << 16
                info.compress_type = zipfile.ZIP_DEFLATED
                archive.writestr(info, inputs[relative], compresslevel=9)
        temporary.replace(output)
    finally:
        if temporary and temporary.exists():
            temporary.unlink()
    return output


if __name__ == "__main__":
    try:
        artifact = build(Path(__file__).resolve().parents[1])
        print(artifact)
        print("SHA-256 " + hashlib.sha256(artifact.read_bytes()).hexdigest())
    except Exception:
        print("TANGAROA_BUILD_INVALID_INPUT", file=sys.stderr)
        sys.exit(1)
