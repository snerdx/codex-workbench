# Team adoption and security

The toolkit standardizes a development workflow. Skills and AGENTS.md are instructions, not an access-control boundary. Installation never relaxes permissions, installs hooks, adds credentials, changes branch protection, or enables integrations.

## Before rollout

Choose supported Codex interfaces and versions, an owner, a reviewed kit release, and an update cadence. Confirm actual skill discovery in each supported interface. Use organization-managed permission controls where available to restrict filesystem/network access, approval behavior, integrations, and plugin sources. Settings vary by client and organization: configure and verify them through your administrator rather than copying an assumed universal config. See [official managed configuration](https://learn.chatgpt.com/docs/enterprise/managed-configuration).

Keep production credentials unavailable to routine development sessions. Use least-privilege disposable test resources. Enforce required application checks and independent review through CI and branch protection, including secret scanning and relevant security checks. A prompt to avoid unsafe actions does not enforce these requirements, and a readiness attestation does not prove them.

## Standard work contract

Every implementation task should establish an observable goal, acceptance criteria, scope/compatibility constraints, relevant checks, and evidence. Let Codex resolve reversible implementation choices while surfacing material uncertainty. For sensitive changes, require a reviewer distinct from the implementing assistant/developer before release. A review skill in the same session remains self-review.

## Pilot and evaluate

Start with a few developers and real, bounded tasks. Track setup time, successful first tasks, review rework, escaped defects, unnecessary interruptions, and update conflicts. Use [behavioral evaluation cases](../evals/scenarios.md) to inspect workflow outcomes. Script tests verify mechanics, not the model's judgment. Run behavioral evaluations in isolated fixtures; never against live production data.

## Release gate

Before sharing a release, run package validation and regression tests, validate skill metadata with the skill-creator checker when available, inspect installer changes, and test a fresh install plus update. Confirm target-client discovery, license terms, owner, and release notes. Do not state that a source-tested package has passed a live plugin-host or model evaluation unless that evaluation actually occurred.
