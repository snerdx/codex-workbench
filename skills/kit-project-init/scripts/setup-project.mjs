import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function targetDirectory(input) {
  if (!input || !fs.existsSync(input) || !fs.statSync(input).isDirectory()) {
    throw new Error('Target must be an existing project directory.');
  }
  return fs.realpathSync(input);
}

// Reject links/junctions at every existing component below the selected target.
export function destination(root, relative) {
  const absolute = path.resolve(root, relative);
  const inside = path.relative(root, absolute);
  if (!inside || inside === '..' || inside.startsWith(`..${path.sep}`) || path.isAbsolute(inside)) {
    throw new Error(`Path escapes target: ${relative}`);
  }
  let cursor = root;
  for (const part of inside.split(path.sep)) {
    cursor = path.join(cursor, part);
    if (fs.existsSync(cursor) || isLink(cursor)) {
      const stats = fs.lstatSync(cursor);
      if (stats.isSymbolicLink()) throw new Error(`Refusing linked destination: ${cursor}`);
      if (cursor !== absolute && !stats.isDirectory()) throw new Error(`Parent is not a directory: ${cursor}`);
    }
  }
  return absolute;
}
function isLink(file) {
  try { return fs.lstatSync(file).isSymbolicLink(); } catch (error) {
    if (error.code === 'ENOENT' || error.code === 'ENOTDIR') return false;
    throw error;
  }
}

const assetRoot = fileURLToPath(new URL('../assets/project/', import.meta.url));
export function planSetup(target) {
  const plans = [];
  for (const name of fs.readdirSync(assetRoot)) {
    const relative = name === 'AGENTS.md' ? 'AGENTS.md' : `docs/codex-kit/${name}`;
    const output = destination(target, relative);
    if (!fs.existsSync(output)) plans.push({relative, content: fs.readFileSync(path.join(assetRoot, name))});
    else if (!fs.statSync(output).isFile()) throw new Error(`Expected a file: ${relative}`);
    else if (name === 'LICENSE' && !fs.readFileSync(output).equals(fs.readFileSync(path.join(assetRoot, name)))) {
      throw new Error(`Conflicting toolkit notice: ${relative}. Preserve and reconcile the notice manually before setup.`);
    }
  }
  if (fs.existsSync(path.join(target, 'AGENTS.md'))) {
    const relative = 'docs/codex-kit/AGENTS-SUGGESTED.md';
    const output = destination(target, relative);
    if (!fs.existsSync(output)) plans.push({relative, content: fs.readFileSync(path.join(assetRoot, 'AGENTS.md'))});
  }
  const setupPath = destination(target, 'docs/codex-kit/SETUP.md');
  if (!fs.existsSync(setupPath)) {
    const evidence = [];
    const manifest = path.join(target, 'package.json');
    // Read project metadata only. Never execute scripts or read environment files.
    if (fs.existsSync(manifest) && !isLink(manifest)) {
      let pkg;
      try { pkg = JSON.parse(fs.readFileSync(manifest, 'utf8')); }
      catch { evidence.push('package.json could not be parsed; inspect it manually.'); }
      if (pkg && typeof pkg.scripts === 'object' && pkg.scripts !== null) {
        for (const name of Object.keys(pkg.scripts)) {
          // Do not echo script bodies; they can contain embedded credentials.
          if (/^[a-zA-Z0-9:_-]+$/.test(name)) evidence.push(`package.json declares script ${name}. Inspect its body and choose the actual package manager before execution.`);
        }
      }
    }
    for (const name of ['package-lock.json', 'pnpm-lock.yaml', 'yarn.lock', 'pyproject.toml', 'Cargo.toml', 'go.mod']) {
      if (fs.existsSync(path.join(target, name))) evidence.push(`Detected ${name}; verify supported versions and commands from source.`);
    }
    const content = '# Setup observations\n\nGenerated observations are proposals, not approved commands or executed checks.\n\n' +
      (evidence.length ? evidence.map(line => `- ${line}`).join('\n') : '- No supported manifest detected. Inspect the project manually.') +
      '\n\nComplete PROJECT.md and verification.json, inspect security settings with your administrator, and confirm live skill discovery. Existing AGENTS.md is preserved; merge AGENTS-SUGGESTED.md manually when present.\n';
    plans.push({relative: 'docs/codex-kit/SETUP.md', content: Buffer.from(content)});
  }
  return plans;
}

export function createFiles(target, plans) {
  for (const item of plans) {
    const output = destination(target, item.relative);
    fs.mkdirSync(path.dirname(output), {recursive: true});
    fs.writeFileSync(output, item.content, {flag: 'wx'});
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const args = process.argv.slice(2);
    const index = args.indexOf('--target');
    if (index < 0 || args.some((arg, i) => arg !== '--target' && arg !== '--dry-run' && i !== index + 1)) throw new Error('Usage: node setup-project.mjs --target <directory> [--dry-run]');
    const target = targetDirectory(args[index + 1]);
    const plans = planSetup(target);
    for (const item of plans) console.log(`CREATE ${item.relative}`);
    if (!args.includes('--dry-run')) createFiles(target, plans);
    console.log(args.includes('--dry-run') ? 'Preview only; no files written.' : 'Project context prepared. Complete setup facts and verify discovery.');
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
