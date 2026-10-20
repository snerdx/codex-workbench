# Codex Workbench

An independent Codex plugin with skills for consistent, secure, and verified development.

Packaged as a Codex plugin, with a tested project-local skill installer. Plugin-host installation is awaiting verification. Install once per repository, then use named skills for implementation, review, testing, documentation, and handoffs.

## 1. Install into your project

Requires Node.js 20+ and Codex CLI or the Codex IDE extension. Clone [Codex Workbench](https://github.com/snerdx/codex-workbench), open a terminal in the downloaded directory, and replace the example path with your existing project directory:

```sh
node scripts/install.mjs --target "/absolute/path/to/your-project" --dry-run
node scripts/install.mjs --target "/absolute/path/to/your-project"
```

On Windows use a quoted path such as `"C:/Projects/my-app"`. Review the preview before installing. No package download is needed. Existing project files and Codex permissions are preserved; conflicting skill files stop installation. Commit the resulting project files through your normal review process.

## 2. Configure with Codex

Open **your project** in Codex, type `/skills` or `$`, and confirm the `kit-` skills appear. Then send:

```text
$kit-project-init
Inspect this repository and configure its project facts and verification
commands. Preserve existing conventions and explain missing decisions.
```

Initialization inspects the project and prepares facts and checks. If your project already has AGENTS.md, Codex must merge the suggested toolkit routing without replacing your rules. No application scripts or dependencies are run merely by installing.

## 3. Start your first task

```text
$kit-implement-change
Goal: [what should work differently]
Acceptance criteria: [observable success and failure cases]
Constraints: [what must remain compatible]
Implement, verify, and report the results.
```

Use `$kit-review-change` for a read-only review, `$kit-test-change` for tests, `$kit-refactor` for behavior-preserving cleanup, `$kit-document-change` for documentation, and `$kit-handoff` to save current work for the next session.

Check setup from your project terminal:

```sh
node .agents/skills/kit-project-init/scripts/doctor.mjs --target .
```

It lists unfinished setup and exits nonzero until required records are complete. It does not execute application checks or prove permissions are enforced.

[Installation, updates, and plugin packaging](docs/INSTALLATION.md) ? [Team security and rollout](docs/TEAM-GUIDE.md) ? [Maintainer checks](docs/MAINTAINING.md)

## License

[MIT](LICENSE), copyright 2026 Laurie Andreola. Applies to the original toolkit skills, scripts, documentation, and templates. Retain its copyright and permission notice when redistributing copies or substantial portions. Using the toolkit does not require you to open-source your application; retained toolkit material remains subject to its notice requirements. Preserve any separately licensed third-party notices. Installation leaves your project's root license unchanged.
