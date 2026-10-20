import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { checkMarkdown } from './markdown-checks.mjs';

export function validatePackage(root) {
  const errors = [];
  let manifest;
  try { manifest = JSON.parse(fs.readFileSync(path.join(root, 'kit-manifest.json'), 'utf8')); }
  catch (error) { return {errors: [`Invalid kit manifest: ${error.message}`]}; }
  if (!Array.isArray(manifest.files) || !manifest.files.length) return {errors: ['Manifest must list package files.']};
  let links = 0, excerpts = 0, skills = 0;
  const names = new Set();
  for (const file of manifest.files) {
    const absolute = path.resolve(root, file);
    const relative = path.relative(root, absolute);
    if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) { errors.push(`Escaping manifest path: ${file}`); continue; }
    if (!fs.existsSync(absolute) || !fs.lstatSync(absolute).isFile()) { errors.push(`Missing regular file: ${file}`); continue; }
    if (file.endsWith('.md')) {
      const contents = fs.readFileSync(absolute, 'utf8');
      const result = checkMarkdown(contents, absolute, root);
      errors.push(...result.errors.map(error => `${file}: ${error}`));
      links += result.links; excerpts += result.excerpts;
      if (file.endsWith('/SKILL.md')) {
        const frontmatter = contents.match(/^---\r?\nname: ([a-z0-9-]+)\r?\ndescription: (.+)\r?\n---/);
        const name = frontmatter?.[1];
        if (!frontmatter || name.length >= 64 || path.basename(path.dirname(absolute)) !== name) errors.push(`Invalid skill frontmatter: ${file}`);
        else if (names.has(name)) errors.push(`Duplicate skill: ${name}`);
        else names.add(name);
        skills++;
      }
    }
    if (file.endsWith('.mjs')) {
      const result = spawnSync(process.execPath, ['--check', absolute], {encoding: 'utf8', timeout: 10000});
      if (result.error || result.status !== 0) errors.push(`Invalid script ${file}: ${result.error?.message || result.stderr.trim()}`);
    }
  }
  try {
    const plugin = JSON.parse(fs.readFileSync(path.join(root, 'plugin.json'), 'utf8'));
    if (plugin.version !== manifest.version || !plugin.name || plugin.extensions?.['com.openai']?.onboardingSkill !== './skills/kit-project-init/SKILL.md') errors.push('Plugin identity/version/onboarding mismatch.');
    if (plugin.license !== 'MIT') errors.push('Plugin must declare the MIT license.');
    const license = fs.readFileSync(path.join(root, 'LICENSE'), 'utf8');
    if (!license.includes('Copyright (c) 2026 Laurie Andreola')) errors.push('Root copyright notice is missing.');
    for (const name of names) {
      const file = path.join(root, 'skills', name, 'LICENSE');
      if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== license) errors.push(`Missing or mismatched license for ${name}`);
    }
    const templateLicense = path.join(root, 'skills/kit-project-init/assets/project/LICENSE');
    if (!fs.existsSync(templateLicense) || fs.readFileSync(templateLicense, 'utf8') !== license) errors.push('Project template license must match the root notice.');
  } catch (error) { errors.push(`Invalid plugin manifest: ${error.message}`); }
  return {errors, files: manifest.files.length, links, excerpts, skills};
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const result = validatePackage(root);
  if (!result.errors.length) {
    const example = spawnSync(process.execPath, [path.join(root, 'examples/active-admin.mjs')], {encoding: 'utf8', timeout: 10000});
    if (example.error || example.status !== 0) result.errors.push(`Example failed: ${example.error?.message || example.stderr.trim()}`);
    else process.stdout.write(example.stdout);
  }
  if (result.errors.length) { console.error(result.errors.join('\n')); process.exitCode = 1; }
  else console.log(`PASS: ${result.files} package files, ${result.skills} skills, ${result.links} links, ${result.excerpts} JavaScript excerpts. Only manifest files checked.`);
}
