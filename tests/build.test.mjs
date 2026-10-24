import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdtempSync, mkdirSync, cpSync, writeFileSync, readFileSync, rmSync, symlinkSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const build = new URL("../scripts/build.py", import.meta.url);
const OUT = "dist/tangaroa-0.2.3.xpi";
const FILES = ["LICENSE-Postbird", "icons/tangaroa-32.png", "icons/tangaroa-48.png",
  "icons/tangaroa-64.png", "manifest.json", "preview.png", "tangaroa.css"];

function fixture() {
  assert.ok(existsSync(build), "explicit allowlist build script must exist");
  const root = mkdtempSync(join(tmpdir(), "tangaroa-build-fixture-"));
  mkdirSync(join(root, "scripts"));
  cpSync(build, join(root, "scripts/build.py"));
  cpSync(new URL("../theme", import.meta.url), join(root, "theme"), { recursive: true });
  return {
    root,
    run: () => spawnSync("python3", [join(root, "scripts/build.py")], { encoding: "utf8" }),
    dispose: () => rmSync(root, { recursive: true, force: true }),
  };
}

function inspectArchive(root, expression) {
  const result = spawnSync("python3", ["-c",
    "import json,zipfile,sys; z=zipfile.ZipFile(sys.argv[1]); m=json.loads(z.read('manifest.json')); print(json.dumps(" + expression + "))",
    join(root, OUT)], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout);
}

test("build packs only the seven allowlisted files and a valid manifest", () => {
  const f = fixture();
  try {
    for (const name of ["secret.css", ".git/config", "icons/tangaroa.svg.bak", "notes/extra.json"]) {
      const file = join(f.root, "theme", name);
      mkdirSync(join(file, ".."), { recursive: true });
      writeFileSync(file, "fixture secret");
    }
    const result = f.run();
    assert.equal(result.status, 0, result.stderr);
    const artifact = inspectArchive(f.root, "{'files':z.namelist(),'manifest':m}");
    assert.deepEqual(artifact.files, FILES);
    assert.equal(artifact.manifest.version, "0.2.3");
    assert.equal(artifact.manifest.browser_specific_settings.gecko.id, "tangaroa@stupalov.github.io");
    assert.equal(artifact.manifest.theme_experiment.stylesheet, "tangaroa.css");
    const first = readFileSync(join(f.root, OUT));
    assert.equal(f.run().status, 0);
    assert.deepEqual(readFileSync(join(f.root, OUT)), first, "two builds must be byte-identical");
  } finally { f.dispose(); }
});

test("packaged compatibility is Gecko 157.0 to 158.*", () => {
  const f = fixture();
  try {
    assert.equal(f.run().status, 0);
    const gecko = inspectArchive(f.root, "m['browser_specific_settings']['gecko']");
    assert.equal(gecko.strict_min_version, "157.0");
    assert.equal(gecko.strict_max_version, "158.*", "the add-on catalogue requires an explicit maximum for theme experiments");
    const file = join(f.root, "theme/manifest.json"), manifest = JSON.parse(readFileSync(file));
    for (const [key, value] of [["strict_min_version", "157.0.1"], ["strict_max_version", "*"]]) {
      const changed = structuredClone(manifest);
      changed.browser_specific_settings.gecko[key] = value;
      writeFileSync(file, JSON.stringify(changed));
      const rejected = f.run();
      assert.notEqual(rejected.status, 0, key);
      assert.match(rejected.stderr, /TANGAROA_BUILD_INVALID_INPUT/);
    }
  } finally { f.dispose(); }
});

test("build rejects file symlinks and symlinked parent directories", () => {
  for (const directory of [false, true]) {
    const f = fixture();
    try {
      if (directory) {
        cpSync(join(f.root, "theme/icons"), join(f.root, "outside"), { recursive: true });
        rmSync(join(f.root, "theme/icons"), { recursive: true });
        symlinkSync(join(f.root, "outside"), join(f.root, "theme/icons"));
      } else {
        unlinkSync(join(f.root, "theme/tangaroa.css"));
        writeFileSync(join(f.root, "outside.css"), "fixture");
        symlinkSync(join(f.root, "outside.css"), join(f.root, "theme/tangaroa.css"));
      }
      const result = f.run();
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /TANGAROA_BUILD_INVALID_INPUT/);
      assert.ok(!existsSync(join(f.root, OUT)));
    } finally { f.dispose(); }
  }
});

test("build rejects malformed or drifted manifests without emitting an archive", () => {
  const variants = {
    json: () => "{",
    "extra-key": (m) => { m.permissions = ["tabs"]; return JSON.stringify(m); },
    version: (m) => { m.version = "0.2.4"; return JSON.stringify(m); },
    id: (m) => { m.browser_specific_settings.gecko.id = "other@example.invalid"; return JSON.stringify(m); },
    stylesheet: (m) => { m.theme_experiment.stylesheet = "other.css"; return JSON.stringify(m); },
    "icon-path": (m) => { m.icons["32"] = "icons/other.png"; return JSON.stringify(m); },
    "duplicate-key": (m) => JSON.stringify(m).replace('"name"', '"name":"x","name"'),
  };
  for (const [name, mutate] of Object.entries(variants)) {
    const f = fixture();
    try {
      const file = join(f.root, "theme/manifest.json");
      writeFileSync(file, mutate(JSON.parse(readFileSync(file))));
      const result = f.run();
      assert.notEqual(result.status, 0, name);
      assert.match(result.stderr, /TANGAROA_BUILD_INVALID_INPUT/);
      assert.ok(!existsSync(join(f.root, OUT)));
    } finally { f.dispose(); }
  }
});
