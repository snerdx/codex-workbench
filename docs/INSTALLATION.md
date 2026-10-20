# Install, update, and remove

The [quick start](../README.md) uses project-local skills so a team can commit the same reviewed workflows with its application. The toolkit source stays separate; do not copy the entire toolkit over an existing project.

## Project-local installation

From the downloaded toolkit directory, run `node scripts/install.mjs --target <existing-project-directory> --dry-run`, inspect the plan, then repeat without `--dry-run`. Quote paths with spaces. Node.js 20+ is required; there are no third-party packages or network calls.

The installer creates `.agents/skills/kit-*`, `docs/codex-kit`, and `.codex-kit-install.json`. It creates root AGENTS.md only when missing. If it exists, it is left byte-for-byte unchanged and suggested routing goes into docs/codex-kit/AGENTS-SUGGESTED.md. Merge that suggestion through $kit-project-init. Existing README, application files, context folders, credentials, .codex configuration, and Git history are preserved.

Conflicting skill files stop the install during preflight before writes. Links/junctions in destination paths are rejected. A filesystem failure during writing can leave a partial install; retain the error output and rerun after resolving access or disk issues. Do not delete unrelated files to recover.

Open the application root in Codex CLI or the IDE extension, check `/skills`, and run `$kit-project-init`. If discovery is stale, start a new session. Avoid installing the same skill bundle globally and per-project: duplicate names can appear. Keep the tested workflow source and version visible in code review.

## Updates

Use a reviewed release of this toolkit, preview `node scripts/install.mjs --target <project> --update --dry-run`, then repeat without `--dry-run`. The receipt tracks skill hashes and release version. Updates replace only tracked skill files whose current contents still match the prior receipt. Customized files fail preflight and require a manual merge. Project facts, commands, session state, and root instructions are never overwritten by updates. Review template changes in the changelog and merge applicable policy updates manually.

If a release removes a tracked file, automatic update stops rather than deleting it. Review and remove only the retired owned files and corresponding receipt entries, then retry. Back up customizations before manual migration. Downgrades use the same ownership checks; they are not automatically prevented.

To uninstall, inspect the receipt, remove only toolkit-owned unchanged skill files and the receipt, and manually remove toolkit routing if desired. Preserve customized skills and project context you still need. No automatic recursive uninstall is supplied.

## Plugin package

This directory also contains [plugin.json](../plugin.json) and a root skills directory using the [official portable plugin format](https://developers.openai.com/plugins/build/plugins). Its onboarding skill is kit-project-init. In a supported plugin host, installation supplies shared skills; the setup helper creates context in the selected project only when authorized. Plugin updates are managed by that host, separately from the repository installer receipt.

CLI/IDE project-local installation is the executable path tested by this kit. Plugin metadata and bundled resources are checked locally; live plugin-host installation, platform support, and organization distribution must be tested before team rollout. The package does not register an MCP server, request credentials, or publish itself. Do not install both distributions into the same Codex scope.

See [official skill discovery and invocation](https://learn.chatgpt.com/docs/build-skills). The original toolkit uses the [MIT license](../LICENSE), copyright 2026 Laurie Andreola. Each installed skill includes its notice; project context includes docs/codex-kit/LICENSE. Keep these notices with retained toolkit material. Your application's root LICENSE is never replaced.
