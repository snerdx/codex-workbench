# Design decisions

Codex Workbench packages a repeatable development workflow for teams adopting Codex in existing repositories. Its design focuses on predictable installation, visible verification, and clear authorization boundaries. It is authored with Codex assistance; code and workflow evidence remain open to inspection.

## Skills for workflows; project files for facts

The seven skill entrypoints describe when and how to perform a task. Detailed procedures live alongside their skill. Project facts, command approvals, and handoffs stay in the application's docs/codex-kit directory, where the team can review them with the code.

This keeps reusable instructions separate from application-specific state. It also means the initializer must inspect the target project: installed templates are not evidence that a stack, command, or requirement has been configured.

**Implementation:** [skills](../agents/README.md), [project setup helper](../skills/kit-project-init/scripts/setup-project.mjs).

## Adopt an existing project without replacing its rules

Installation targets an explicitly selected existing directory. The installer preserves root AGENTS.md and supplies a routing suggestion when that file already exists. It does not replace the application's README or LICENSE, execute package scripts, or modify Codex permissions. A preview shows planned writes before installation.

This leaves teams responsible for merging instructions and resolving conflicts. That manual step is preferable to silently making the toolkit authoritative over existing project requirements. Destination links and junctions are rejected to keep writes inside the selected directory.

**Evidence:** preservation, preview, conflict-preflight, and linked-destination tests in [toolkit.test.mjs](../tests/toolkit.test.mjs).

## Update files only when ownership is established

The installation receipt records SHA-256 hashes of skill files. During an update, replacement is allowed when the current file matches the prior receipt. A customized skill stops the update and requires a manual merge. Project facts and handoffs are preserved.

Hashes establish content identity, not publisher authenticity. Source review and a trusted distribution channel still matter. Preflight handles predictable conflicts before writes; unexpected filesystem errors can leave a partial installation. Removed files require manual migration instead of automatic deletion.

**Implementation:** [installer](../scripts/install.mjs). **Evidence:** customized-update refusal and owned-update tests.

## Report verification evidence without inventing approval

The project registry records inspected commands, working directories, baseline status, and reasons for missing or failing checks. The readiness helper reports incomplete setup and checks the shape of these records. It does not execute application tests or independently establish that a developer's attestations are true.

Mechanical package tests cover installer and validator behavior. Manual model-evaluation scenarios address a different question: whether Codex follows the workflow under realistic requests. Both matter; one does not substitute for the other.

**Implementation:** [readiness helper](../skills/kit-project-init/scripts/doctor.mjs). **Evaluation plan:** [behavioral scenarios](../evals/scenarios.md).

## Keep review separate from mutation and release authority

The review skill is read-only by default, including session files. Findings require a trigger, consequence, source evidence, and confidence. Using the reviewer in the implementing session is self-review, not independent approval.

AGENTS.md and skills guide behavior. Actual access limits belong in Codex permission settings and organization controls; merge and release requirements belong in CI, branch protection, and the team's review process. The toolkit does not claim to enforce these controls through prose.

**Workflow:** [review skill](../skills/kit-review-change/SKILL.md). **Deployment boundary:** [team guide](TEAM-GUIDE.md).

## Supply both repository skills and plugin packaging

Project-local installation is the executable path covered by the regression suite. The portable plugin manifest bundles the same skills and identifies an onboarding skill. Live plugin-host installation and live CLI/IDE discovery remain pilot checks.

Keeping both paths lets repository users adopt the workflows while plugin-host validation proceeds. It adds a maintenance obligation: shared references, licenses, and setup assets must remain self-contained in the skill package.

**Package:** [plugin.json](../plugin.json). **Status:** [verification record](RELEASE-0.2.0.md).
