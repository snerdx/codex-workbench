---
name: kit-project-init
description: Initialize an existing or new repository for this Codex toolkit. Use for project onboarding and configuring project facts and verification commands, not routine implementation.
---

# Initialize a project

Inspect the target repository and root AGENTS.md before editing. Installation is not authorization for production access, external writes, or permission changes.

Run the packaged helper with Node.js 20+ from this skill's directory: `node scripts/setup-project.mjs --target <absolute-project-path> --dry-run`. Inspect the plan, then run the same command without `--dry-run` when setup edits are authorized. The helper creates missing context files only, proposes commands from package.json without executing them, and preserves existing files. With plugin installation, this helper supplies project context; with repository installation it is safe to repeat.

Read the resulting docs/codex-kit/PROJECT.md, VERIFICATION.md, verification.json, and SETUP.md. Inspect actual manifests, lockfiles, source entry points, tests, and CI configuration. Record confirmed versions and commands with their sources. Do not read credential values. Distinguish detected facts from assumptions. Ask only about material unknowns such as intended users, production boundaries, and acceptance criteria.

Update project facts and the command registry within setup scope. For verification.json, approve a command only after inspecting its definition and side effects; record the exact command, working directory, and latest observed status. Execute appropriate local baseline checks under existing permissions. Do not execute every detected script automatically, especially publish, deploy, reset, or migrate scripts. Do not install dependencies or initialize Git unless that action is authorized.

If AGENTS.md already existed, manually merge the suggested routing in docs/codex-kit/AGENTS-SUGGESTED.md with existing rules without replacing them. Explain unresolved conflicts. Do not alter .codex settings, credentials, remote resources, or CI branch protection automatically.

Report configured facts, baseline evidence, missing decisions, and a small first task. Use the packaged readiness helper, `node scripts/doctor.mjs --target <project>`, to identify remaining setup gaps. A successful helper check is not proof of live skill discovery, enforced permissions, or application safety. Ask the developer to confirm the skills appear in the target Codex session. Never claim independent approval.
