import path from 'node:path';
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

// Checks documented inline/reference links and fenced JS, not full CommonMark.
export function inspectMarkdown(contents) {
  const blocks = [], prose = [], errors = [];
  let fence;
  for (const line of contents.split(/\r?\n/)) {
    const opening = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
    if (!fence && opening) fence = {character: opening[1][0], length: opening[1].length, info: opening[2].trim(), lines: []};
    else if (fence) {
      const closing = line.match(/^ {0,3}(`+|~+)\s*$/);
      if (closing && closing[1][0] === fence.character && closing[1].length >= fence.length) {
        blocks.push({info: fence.info, code: fence.lines.join('\n')}); fence = undefined;
      } else fence.lines.push(line);
    } else prose.push(line);
  }
  if (fence) errors.push('Unclosed fenced code block.');
  const normalize = label => label.replace(/\s+/g, ' ').trim().toLowerCase();
  function parseDestination(text) {
    text = text.trimStart();
    if (text.startsWith('<')) {
      const end = text.indexOf('>');
      return end < 0 ? null : text.slice(1, end);
    }
    let depth = 0, value = '';
    for (let i = 0; i < text.length; i++) {
      const character = text[i];
      if (character === '\\' && i + 1 < text.length) { value += text[++i]; continue; }
      if (character === '(') depth++;
      if (character === ')') { if (!depth) break; depth--; }
      if (/\s/.test(character) && !depth) break;
      value += character;
    }
    return value || null;
  }
  const definitions = new Map(), remaining = [];
  for (const line of prose) {
    const definition = line.match(/^ {0,3}\[([^\]]+)\]:\s*(.*)$/);
    if (definition) definitions.set(normalize(definition[1]), parseDestination(definition[2]));
    else remaining.push(line);
  }
  const text = remaining.join('\n').replace(/(`+)[\s\S]*?\1/g, '');
  const links = [];
  const pattern = /(?<!\\)\[([^\]\n]+)\](?:\((<[^>]*>|(?:\\.|[^()\n]|\([^()\n]*\))*)\)|\[([^\]\n]*)\])?/g;
  for (const match of text.matchAll(pattern)) {
    if (match[2] !== undefined) {
      const target = parseDestination(match[2]);
      if (target) links.push(target);
    } else if (match[3] !== undefined) {
      const label = normalize(match[3] || match[1]);
      const target = definitions.get(label);
      if (!target) errors.push(`Undefined reference link: ${label}`);
      else links.push(target);
    } else {
      const target = definitions.get(normalize(match[1]));
      if (target) links.push(target);
    }
  }
  return {links, blocks, errors};
}

export function checkMarkdown(contents, absolute, root) {
  const result = inspectMarkdown(contents);
  const errors = [...result.errors];
  const assets = path.join(root, 'skills', 'kit-project-init', 'assets', 'project');
  for (const target of result.links) {
    if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(target)) continue;
    let local;
    try { local = decodeURIComponent(target.split(/[?#]/)[0]); }
    catch { errors.push(`Invalid encoded destination: ${target}`); continue; }
    let output = path.resolve(path.dirname(absolute), local);
    if (path.dirname(absolute) === assets) {
      if (path.basename(absolute) === 'AGENTS.md' && local.startsWith('docs/codex-kit/')) output = path.join(assets, local.slice('docs/codex-kit/'.length));
      else if (local === '../../AGENTS.md') output = path.join(assets, 'AGENTS.md');
    }
    const relative = path.relative(root, output);
    if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative) || !fs.existsSync(output)) errors.push(`Invalid local link: ${target}`);
  }
  let excerpts = 0;
  for (const block of result.blocks) {
    const [language, mode] = block.info.split(/\s+/);
    if (!['javascript', 'js', 'mjs', 'cjs'].includes(language) || mode === 'fragment') continue;
    const syntax = spawnSync(process.execPath, ['--check', `--input-type=${language === 'cjs' || mode === 'script' ? 'commonjs' : 'module'}`], {input: block.code, encoding: 'utf8', timeout: 10000});
    if (syntax.error || syntax.status !== 0) errors.push(`Invalid ${block.info} excerpt: ${syntax.error?.message || syntax.stderr.trim()}`);
    excerpts++;
  }
  return {errors, links: result.links.length, excerpts};
}
