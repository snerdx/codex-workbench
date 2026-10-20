import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { checkMarkdown } from '../scripts/markdown-checks.mjs';
import { readiness } from '../skills/kit-project-init/scripts/doctor.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
function fixture(t) {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'codex-kit-test-'));
  t.after(() => {
    if (path.dirname(temporary) !== fs.realpathSync(os.tmpdir()) || !path.basename(temporary).startsWith('codex-kit-test-')) throw new Error('Unsafe cleanup path');
    fs.rmSync(temporary, {recursive: true, force: true});
  });
  return temporary;
}
function run(script, args = [], cwd = root) {
  const result = spawnSync(process.execPath, [script, ...args], {cwd, encoding: 'utf8', timeout: 30000});
  if (result.error) throw result.error;
  return result;
}
function install(target, ...args) { return run(path.join(root, 'scripts/install.mjs'), ['--target', target, ...args]); }
function write(target, relative, text) {
  const output = path.join(target, relative);
  fs.mkdirSync(path.dirname(output), {recursive: true});
  fs.writeFileSync(output, text);
}

test('dry run writes nothing, including in a path with spaces', t => {
  const temporary = fixture(t), target = path.join(temporary, 'existing app');
  fs.mkdirSync(target);
  write(target, 'README.md', 'Keep this README.');
  const result = install(target, '--dry-run');
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(fs.readdirSync(target), ['README.md']);
  assert.match(result.stdout, /Preview only/);
});

test('fresh installation supplies seven skills, clean templates, and honest readiness gaps', t => {
  const target = fixture(t);
  const result = install(target);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(fs.readdirSync(path.join(target, '.agents/skills')).length, 7);
  const license = fs.readFileSync(path.join(root, 'LICENSE'), 'utf8');
  assert.match(license, /Copyright \(c\) 2026 Laurie Andreola/);
  assert.equal(fs.readFileSync(path.join(target, 'docs/codex-kit/LICENSE'), 'utf8'), license);
  for (const skill of fs.readdirSync(path.join(target, '.agents/skills'))) {
    assert.equal(fs.readFileSync(path.join(target, '.agents/skills', skill, 'LICENSE'), 'utf8'), license);
  }
  const session = fs.readFileSync(path.join(target, 'docs/codex-kit/SESSION.md'), 'utf8');
  assert.doesNotMatch(session, /remediation session|EPERM|2026-10-20/);
  assert.ok(readiness(target).length > 0);
  const doctor = run(path.join(target, '.agents/skills/kit-project-init/scripts/doctor.mjs'), ['--target', target]);
  assert.equal(doctor.status, 1);
  assert.match(doctor.stdout, /No application checks were executed/);
});

test('existing instructions and files survive install and repeated setup byte-for-byte', t => {
  const target = fixture(t);
  const original = '# Existing team rules\r\nDo not replace.\r\n';
  write(target, 'AGENTS.md', original);
  write(target, 'README.md', 'Existing project README');
  write(target, 'LICENSE', 'Existing proprietary application license');
  write(target, 'context/AGENTS.md', 'Legitimate nested rules');
  write(target, 'package.json', JSON.stringify({scripts: {test: 'echo example-secret-value'}}));
  assert.equal(install(target).status, 0);
  assert.equal(fs.readFileSync(path.join(target, 'AGENTS.md'), 'utf8'), original);
  assert.equal(fs.readFileSync(path.join(target, 'README.md'), 'utf8'), 'Existing project README');
  assert.equal(fs.readFileSync(path.join(target, 'LICENSE'), 'utf8'), 'Existing proprietary application license');
  assert.equal(fs.readFileSync(path.join(target, 'context/AGENTS.md'), 'utf8'), 'Legitimate nested rules');
  assert.ok(fs.existsSync(path.join(target, 'docs/codex-kit/AGENTS-SUGGESTED.md')));
  const observations = fs.readFileSync(path.join(target, 'docs/codex-kit/SETUP.md'), 'utf8');
  assert.match(observations, /declares script test/);
  assert.doesNotMatch(observations, /example-secret-value/);
  const setup = path.join(target, '.agents/skills/kit-project-init/scripts/setup-project.mjs');
  assert.equal(run(setup, ['--target', target]).status, 0);
  assert.equal(fs.readFileSync(path.join(target, 'AGENTS.md'), 'utf8'), original);
});

test('skill conflicts fail before creating project context or receipt', t => {
  const target = fixture(t);
  const relative = '.agents/skills/kit-test-change/SKILL.md';
  write(target, relative, 'My custom skill');
  const result = install(target);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Conflict/);
  assert.equal(fs.existsSync(path.join(target, 'docs')), false);
  assert.equal(fs.existsSync(path.join(target, '.codex-kit-install.json')), false);
  assert.equal(fs.readFileSync(path.join(target, relative), 'utf8'), 'My custom skill');
});

test('conflicting toolkit notice stops installation without changing either license', t => {
  const target = fixture(t);
  write(target, 'LICENSE', 'Application license');
  write(target, 'docs/codex-kit/LICENSE', 'Existing toolkit notice requiring manual reconciliation');
  const result = install(target);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Conflicting toolkit notice/);
  assert.equal(fs.existsSync(path.join(target, '.agents')), false);
  assert.equal(fs.existsSync(path.join(target, '.codex-kit-install.json')), false);
  assert.equal(fs.readFileSync(path.join(target, 'LICENSE'), 'utf8'), 'Application license');
  assert.equal(fs.readFileSync(path.join(target, 'docs/codex-kit/LICENSE'), 'utf8'), 'Existing toolkit notice requiring manual reconciliation');
});

test('updates reject customized skills without overwriting project facts', t => {
  const target = fixture(t);
  assert.equal(install(target).status, 0);
  write(target, '.agents/skills/kit-review-change/SKILL.md', 'Customized review');
  write(target, 'docs/codex-kit/PROJECT.md', 'Confirmed project facts');
  const result = install(target, '--update');
  assert.equal(result.status, 1);
  assert.equal(fs.readFileSync(path.join(target, '.agents/skills/kit-review-change/SKILL.md'), 'utf8'), 'Customized review');
  assert.equal(fs.readFileSync(path.join(target, 'docs/codex-kit/PROJECT.md'), 'utf8'), 'Confirmed project facts');
});

test('reviewed source updates replace owned unchanged skills and preserve project context', t => {
  const temporary = fixture(t), source = path.join(temporary, 'source'), target = path.join(temporary, 'app');
  fs.cpSync(root, source, {recursive: true}); fs.mkdirSync(target);
  const installer = path.join(source, 'scripts/install.mjs');
  assert.equal(run(installer, ['--target', target]).status, 0);
  write(target, 'docs/codex-kit/PROJECT.md', 'Customized project profile');
  const relative = 'skills/kit-review-change/SKILL.md';
  fs.appendFileSync(path.join(source, relative), '\nRelease addition.\n');
  const result = run(installer, ['--target', target, '--update']);
  assert.equal(result.status, 0, result.stderr);
  assert.match(fs.readFileSync(path.join(target, '.agents', relative), 'utf8'), /Release addition/);
  assert.equal(fs.readFileSync(path.join(target, 'docs/codex-kit/PROJECT.md'), 'utf8'), 'Customized project profile');
});

test('linked destination directory is rejected before writes', t => {
  const temporary = fixture(t), target = path.join(temporary, 'app'), outside = path.join(temporary, 'outside');
  fs.mkdirSync(target); fs.mkdirSync(outside);
  try { fs.symlinkSync(outside, path.join(target, '.agents'), process.platform === 'win32' ? 'junction' : 'dir'); }
  catch (error) { if (['EPERM', 'EACCES'].includes(error.code)) { t.skip('Host does not permit test link creation.'); return; } throw error; }
  const result = install(target);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /linked destination/);
  assert.deepEqual(fs.readdirSync(outside), []);
});

test('readiness distinguishes missing setup from documented failed baseline', t => {
  const target = fixture(t);
  assert.equal(install(target).status, 0);
  const profilePath = path.join(target, 'docs/codex-kit/PROJECT.md');
  const completed = fs.readFileSync(profilePath, 'utf8').replace(/:\s*TBD\b/g, ': Not applicable for this isolated fixture');
  write(target, 'docs/codex-kit/PROJECT.md', completed);
  const registry = {discoveryConfirmed: true, securityReview: 'confirmed', checks: [{name: 'unit', command: 'npm test', cwd: '.', approved: true, status: 'failed', reason: 'Known baseline defect tracked in issue 1'}]};
  write(target, 'docs/codex-kit/verification.json', JSON.stringify(registry));
  assert.deepEqual(readiness(target), []);
  registry.checks[0].reason = '';
  write(target, 'docs/codex-kit/verification.json', JSON.stringify(registry));
  assert.ok(readiness(target).some(gap => gap.includes('Explain incomplete baseline')));
});

test('link checker accepts titles, angle/encoded spaces, references, parentheses and multiple links', t => {
  const target = fixture(t);
  for (const name of ['README.md', 'file with spaces.md', 'file(name).md']) write(target, name, '# Target');
  const markdown = '[A](README.md "Title") [B](<file with spaces.md>) [C](file%20with%20spaces.md) [D](file(name).md)\n[Reference][r]\n[r]: README.md "Title"\n';
  const result = checkMarkdown(markdown, path.join(target, 'fixture.md'), target);
  assert.deepEqual(result.errors, []);
  assert.equal(result.links, 5);
});

test('broken and undefined references fail', t => {
  const target = fixture(t);
  const broken = checkMarkdown('[Missing][guide]\n[guide]: does-not-exist.md\n', path.join(target, 'fixture.md'), target);
  assert.ok(broken.errors.some(error => error.includes('Invalid local link')));
  const missing = checkMarkdown('[Missing][undefined]\n', path.join(target, 'fixture.md'), target);
  assert.ok(missing.errors.some(error => error.includes('Undefined reference')));
});

test('JS module syntax passes and invalid js/tilde fences fail without executing snippets', t => {
  const target = fixture(t), file = path.join(target, 'fixture.md');
  assert.deepEqual(checkMarkdown('```javascript\nimport fs from "node:fs";\nexport const ready = true;\nthrow new Error("must not execute");\n```', file, target).errors, []);
  for (const fence of ['```js\nconst = ;\n```', '~~~javascript\nconst = ;\n~~~']) {
    assert.ok(checkMarkdown(fence, file, target).errors.some(error => error.includes('Invalid')));
  }
});

test('package validator ignores unrelated project documents and legitimate nested instructions', t => {
  const temporary = fixture(t), copy = path.join(temporary, 'source');
  fs.cpSync(root, copy, {recursive: true});
  write(copy, 'unrelated.md', '```js\nconst = ;\n```\n[broken](missing.md)');
  write(copy, 'context/AGENTS.md', '# Legitimate nested instructions');
  const result = run(path.join(copy, 'scripts/validate-kit.mjs'));
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Only manifest files checked/);
});

test('package validator reports a missing required skill', t => {
  const temporary = fixture(t), copy = path.join(temporary, 'source');
  fs.cpSync(root, copy, {recursive: true});
  fs.unlinkSync(path.join(copy, 'skills/kit-review-change/SKILL.md'));
  const result = run(path.join(copy, 'scripts/validate-kit.mjs'));
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Missing regular file/);
});
