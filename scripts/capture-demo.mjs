import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';

// Records real helper output only. It does not simulate a Codex conversation.
const root = fileURLToPath(new URL('../', import.meta.url));
const temporary = fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()), 'workbench-demo-'));
const project = path.join(temporary, 'example-project');
const outputs = [];
function record(displayCommand, script, args, cwd, expectedStatus) {
  const result = spawnSync(process.execPath, [script, ...args], {cwd, encoding: 'utf8', timeout: 15000});
  if (result.error) throw result.error;
  assert.equal(result.status, expectedStatus, result.stderr);
  assert.equal(result.stderr, '', 'Demo must not hide stderr.');
  outputs.push({displayCommand, exitCode: result.status, stdout: result.stdout});
}

try {
  fs.mkdirSync(project);
  const installer = path.join(root, 'scripts/install.mjs');
  record('node scripts/install.mjs --target ./example-project --dry-run', installer, ['--target', project, '--dry-run'], root, 0);
  assert.deepEqual(fs.readdirSync(project), [], 'Preview wrote project files.');
  record('node scripts/install.mjs --target ./example-project', installer, ['--target', project], root, 0);
  record('node .agents/skills/kit-project-init/scripts/doctor.mjs --target .', path.join(project, '.agents/skills/kit-project-init/scripts/doctor.mjs'), ['--target', '.'], project, 1);

  const assets = path.join(root, 'assets');
  fs.mkdirSync(assets, {recursive: true});
  fs.writeFileSync(path.join(assets, 'demo-output.json'), JSON.stringify({
    description: 'Actual CLI output from a disposable empty project. Display commands use a relative fixture path in place of the temporary absolute path. Installer file listings are shortened only in the SVG presentation. No live Codex session or application tests are represented.',
    runtime: process.version,
    platform: process.platform,
    outputs,
  }, null, 2) + '\n');

  const rows = [];
  const wrap = (text, limit = 117) => {
    const lines = [];
    while (text.length > limit) {
      const at = text.lastIndexOf(' ', limit);
      const cut = at > 30 ? at : limit;
      lines.push(text.slice(0, cut)); text = text.slice(cut).trimStart();
    }
    return [...lines, text];
  };
  function row(text, color = '#bdcddd') { for (const line of wrap(text)) rows.push({text: line, color}); }
  row('$ ' + outputs[0].displayCommand, '#6de2ce');
  const preview = outputs[0].stdout.trimEnd().split(/\r?\n/);
  const skill = preview.find(line => line.endsWith('kit-project-init/SKILL.md'));
  assert.ok(skill);
  row(skill);
  row(`[${preview.length - 2} more file operations omitted from this view]`, '#839db2');
  row(preview.at(-1));
  row('');
  row('$ ' + outputs[1].displayCommand, '#6de2ce');
  row(outputs[1].stdout.trimEnd().split(/\r?\n/).at(-1));
  row('');
  row('$ ' + outputs[2].displayCommand, '#6de2ce');
  for (const line of outputs[2].stdout.trimEnd().split(/\r?\n/)) row(line, line.startsWith('ACTION:') ? '#d9be85' : '#bdcddd');
  const height = 124 + rows.length * 27;
  const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
  const text = rows.map((item, index) => `<text x="32" y="${99 + index * 27}" fill="${item.color}">${escape(item.text)}</text>`).join('\n');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="${height}" viewBox="0 0 1280 ${height}" role="img" aria-labelledby="title desc">
<title id="title">Recorded installer preview, installation, and setup check</title>
<desc id="desc">Actual output captured from a disposable empty project. Preview writes nothing, installation adds the toolkit, and the readiness helper reports unfinished project configuration. File lists are abbreviated. No application tests or live Codex session are represented.</desc>
<rect width="1280" height="${height}" rx="14" fill="#0b1729"/>
<path d="M0 57 H1280" stroke="#294257"/>
<circle cx="31" cy="29" r="5" fill="#607c93"/><circle cx="50" cy="29" r="5" fill="#607c93"/><circle cx="69" cy="29" r="5" fill="#6de2ce"/>
<text x="95" y="34" fill="#8fa9bd" font-family="Segoe UI,Arial,sans-serif" font-size="14">CAPTURED CLI OUTPUT / DISPOSABLE PROJECT / FILE LISTS ABBREVIATED</text>
<g font-family="Consolas,Menlo,monospace" font-size="16">${text}</g></svg>\n`;
  fs.writeFileSync(path.join(assets, 'installation-demo.svg'), svg);
  console.log('Captured real preview, install, and readiness output. Wrote assets/demo-output.json and assets/installation-demo.svg.');
} finally {
  if (path.dirname(temporary) !== fs.realpathSync(os.tmpdir()) || !path.basename(temporary).startsWith('workbench-demo-')) throw new Error('Unexpected cleanup target.');
  fs.rmSync(temporary, {recursive: true, force: true});
}
