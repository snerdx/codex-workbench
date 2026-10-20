import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { targetDirectory, destination, planSetup, createFiles } from '../skills/kit-project-init/scripts/setup-project.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const hash = content => crypto.createHash('sha256').update(content).digest('hex');
export function install(input, {dryRun = false, update = false} = {}) {
  const target = targetDirectory(input);
  if (target === fs.realpathSync(root)) throw new Error('Choose your application directory, not the toolkit source.');
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'plugin.json'), 'utf8'));
  const receiptPath = destination(target, '.codex-kit-install.json');
  let receipt;
  if (fs.existsSync(receiptPath)) {
    receipt = JSON.parse(fs.readFileSync(receiptPath, 'utf8'));
    if (receipt.name !== pkg.name || !receipt.files || typeof receipt.files !== 'object') throw new Error('Unrecognized installation receipt.');
  }
  if (update && !receipt) throw new Error('No installation receipt; install first.');
  const plans = [];
  const hashes = {};
  const walk = directory => fs.readdirSync(directory, {withFileTypes: true}).flatMap(entry => {
    const file = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Source links are not allowed: ${file}`);
    return entry.isDirectory() ? walk(file) : [file];
  });
  for (const source of walk(path.join(root, 'skills'))) {
    const relative = path.join('.agents', 'skills', path.relative(path.join(root, 'skills'), source)).split(path.sep).join('/');
    const output = destination(target, relative);
    const content = fs.readFileSync(source);
    hashes[relative] = hash(content);
    if (fs.existsSync(output)) {
      const current = hash(fs.readFileSync(output));
      if (current === hashes[relative]) continue;
      if (!update || !receipt || receipt.files[relative] !== current) throw new Error(`Conflict: ${relative}. Preserve or merge custom edits manually; nothing written.`);
      plans.push({relative, content, replace: true});
    } else plans.push({relative, content});
  }
  // Fail before any writes if an old tracked skill was edited or disappeared from this release.
  for (const relative of Object.keys(receipt?.files || {})) {
    if (!Object.hasOwn(hashes, relative)) throw new Error(`Release removes ${relative}; migrate it manually before updating. Nothing written.`);
  }
  const setup = planSetup(target);
  for (const item of [...plans, ...setup]) console.log(`${item.replace ? 'UPDATE' : 'CREATE'} ${item.relative}`);
  if (dryRun) { console.log('Preview only; no files written.'); return; }
  for (const item of plans) {
    const output = destination(target, item.relative);
    fs.mkdirSync(path.dirname(output), {recursive: true});
    fs.writeFileSync(output, item.content, {flag: item.replace ? 'w' : 'wx'});
  }
  createFiles(target, setup);
  fs.writeFileSync(receiptPath, JSON.stringify({name: pkg.name, version: pkg.version, files: hashes}, null, 2) + '\n', {flag: receipt ? 'w' : 'wx'});
  console.log(`Installed ${pkg.name} ${pkg.version}. Open Codex in the target and run $kit-project-init.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const args = process.argv.slice(2);
    const index = args.indexOf('--target');
    if (index < 0 || args.some((arg, i) => !['--target', '--dry-run', '--update'].includes(arg) && i !== index + 1)) throw new Error('Usage: node scripts/install.mjs --target <project> [--dry-run] [--update]');
    install(args[index + 1], {dryRun: args.includes('--dry-run'), update: args.includes('--update')});
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
