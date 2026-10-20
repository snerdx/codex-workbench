# Toolkit verification

Run from the toolkit source directory with Node.js 20+:

| Check | Command | Purpose |
|---|---|---|
| Package validation | `node scripts/validate-kit.mjs` | Manifest files, skills, links, JavaScript syntax, runnable example |
| Regression tests | `node --test tests/toolkit.test.mjs` | Installer preservation, dry run, updates, readiness, validator failure modes |
| Example | `node examples/active-admin.mjs` | Predicate behavior regression checks |

For installed projects, the authoritative application registry is docs/codex-kit/verification.json, supported by VERIFICATION.md beside it. The [project-init templates](../skills/kit-project-init/assets/project/VERIFICATION.md) explain required fields. Source package checks do not establish application correctness, live skill discovery, or permission enforcement. Record exact checks and outcomes in maintainer release notes; keep distributed session templates clean.
