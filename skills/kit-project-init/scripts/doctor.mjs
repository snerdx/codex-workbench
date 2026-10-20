import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { destination, targetDirectory } from './setup-project.mjs';

export function readiness(target) {
  const gaps = [];
  const read = relative => {
    const file = destination(target, relative);
    if (!fs.existsSync(file)) { gaps.push(`Missing ${relative}`); return ''; }
    return fs.readFileSync(file, 'utf8');
  };
  const agents = read('AGENTS.md');
  if (!agents.includes('docs/codex-kit/PROJECT.md')) gaps.push('Merge toolkit context routing into AGENTS.md.');
  const profile = read('docs/codex-kit/PROJECT.md');
  if (/:\s*TBD\b/.test(profile)) gaps.push('Complete project facts in PROJECT.md; use explicit not-applicable values where appropriate.');
  const raw = read('docs/codex-kit/verification.json');
  let registry;
  try { registry = JSON.parse(raw); } catch { gaps.push('verification.json must contain valid JSON.'); }
  if (registry) {
    if (!Array.isArray(registry.checks) || !registry.checks.length) gaps.push('Register at least one applicable verification check.');
    else for (const check of registry.checks) {
      if (!check || typeof check.command !== 'string' || !check.command.trim() || typeof check.cwd !== 'string' || !check.cwd.trim()) {
        gaps.push('Each check needs a command and working directory.'); continue;
      }
      if (check.approved !== true) gaps.push(`Inspect and approve check: ${check.name || 'unnamed'}`);
      if (!['passed', 'failed', 'not run'].includes(check.status)) gaps.push(`Record observed status for: ${check.name || 'unnamed'}`);
      if (check.status !== 'passed' && (typeof check.reason !== 'string' || !check.reason.trim())) gaps.push(`Explain incomplete baseline for: ${check.name || 'unnamed'}`);
    }
    if (registry.securityReview !== 'confirmed') gaps.push('Record administrator/developer confirmation of actual permission and release controls.');
    if (registry.discoveryConfirmed !== true) gaps.push('Confirm skills and project instructions load in the actual Codex session.');
  }
  return gaps;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (process.argv.length !== 4 || process.argv[2] !== '--target') throw new Error('Usage: node doctor.mjs --target <directory>');
    const gaps = readiness(targetDirectory(process.argv[3]));
    for (const gap of gaps) console.log(`ACTION: ${gap}`);
    console.log(gaps.length ? 'Setup incomplete. No application checks were executed.' : 'Setup records complete. Permissions, discovery, and check results are user attestations, not independently enforced or re-tested by this helper.');
    process.exitCode = gaps.length ? 1 : 0;
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
