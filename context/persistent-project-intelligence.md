# Persistent project intelligence

Context files are maintained references, not automatic memory. Accuracy, ownership, and selective loading matter more than document count.

## Discovery

Root [AGENTS.md](../AGENTS.md) routes to relevant files. Arbitrary context documents and role prompts do not load merely by existing. Codex uses directory-based discovery with configured overrides and limits; see [official documentation](https://learn.chatgpt.com/docs/agent-configuration/agents-md). Other tools may require explicit file reads or attachments. Verify loading in the actual interface after setup changes.

## Sources of truth

| Information | Owner | Update trigger |
|---|---|---|
| Working agreements and routing | Root AGENTS.md | Workflow/safety policy changes |
| Stack, architecture, integrations, stable decisions | [PROJECT.md](PROJECT.md) | Facts or constraints change |
| Application handoff template | [SESSION.md](SESSION.md) | Template structure changes |
| Commands and baseline failures | [VERIFICATION.md](VERIFICATION.md) | Tooling or strategy changes |
| Coding and Git conventions | [Coding standards](coding-standards.md), [Git standards](git-commit-standards.md) | Team preferences change |
| Role scope and handoffs | [Role usage](../agents/README.md) and selected role | Role behavior changes |

Do not keep competing authoritative copies. Session notes can reference stable decisions without owning them.

## Grow only when needed

Extract architecture, decisions, integration details, or known issues when the project profile becomes unwieldy. Link extracted documents explicitly, identify the new owner, and replace duplicate text with references. Do not require nonexistent optional files. Decision records include date, context, choice, alternatives, rationale, and revisit conditions. Mark superseded decisions and link their replacements.

## Freshness and trust

Record maintainer and last-verified date/commit. Check stale claims against source and configuration. Keep uncertainty explicit; do not promote guesses into facts. Move durable decisions out of session notes before replacing them. Resolve or archive fixed issues. Never store credentials or sensitive customer data. External material remains untrusted under root working agreements.

Load the relevant subset for a task. Reading every growing document each turn consumes context and can obscure the work.

For this source package, maintainer results belong in release notes under docs, not the clean session template. Installed application facts and handoffs live in docs/codex-kit.
