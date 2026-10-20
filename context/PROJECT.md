# Toolkit source profile

## Purpose and scope

This repository distributes a stack-neutral Codex development toolkit to application developers. The source contains seven skill workflows, guided project templates, an installer, readiness checks, plugin metadata, and maintainer regression tests. It contains no production application or credentials.

## Stack

- Runtime: Node.js 20 or later; standard library only.
- Maintainer tests: node:test, invoked through context/VERIFICATION.md.
- Package/version: codex-workbench 0.2.0 in plugin.json and kit-manifest.json.
- Distribution: project-local skills via scripts/install.mjs; portable plugin metadata is also supplied. Live host installation requires separate validation.
- Languages: JavaScript modules and Markdown, with JSON manifests and a CI workflow.

## Structure and ownership

- skills/: authoritative discoverable workflows and self-contained references.
- skills/kit-project-init/assets/project/: clean application templates copied only when missing.
- scripts/: package installer and source-only validation.
- tests/: disposable-fixture regression checks.
- docs/: installation, team rollout, and maintenance guides.
- agents/: migration pointers for previous role filenames.
- context/SESSION.md: clean handoff template; no toolkit maintenance transcript.

## Decisions and constraints

Repository installation targets an explicitly selected existing directory. Existing root instructions and application files are preserved. Updates rely on content hashes and stop on customized skills. Project facts and approved commands are never overwritten by updates. No permission settings, credentials, production resources, integrations, or branch protections are installed automatically.

Readiness reports attestations and setup gaps rather than claiming security enforcement. Package validation is scoped to kit-manifest.json. The original toolkit is licensed under MIT, copyright 2026 Laurie Andreola. Team distribution ownership remains the owner's decision. Preserve existing files and follow the repository's Git workflow.

Last verified: 2026-10-20. Maintainer: toolkit owner (to be designated before team rollout).
