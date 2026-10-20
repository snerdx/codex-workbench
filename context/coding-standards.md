# Coding standards

Project defaults for implementation. Explicit task requirements and the [project profile](PROJECT.md) may override preferences. Follow [working agreements](../AGENTS.md) for authority, workspace safety, and authorization.

## Readability and organization

- Prefer clear names, explicit contracts, and focused functions using established language/framework conventions.
- Split functions when responsibility or complexity warrants it. Line counts are review signals, not mandatory limits.
- Name meaningful domain values and units. Do not extract every literal without improving understanding.
- Follow the repository formatter, import order, naming, structure, and test placement. Avoid unrelated reformatting.
- Remove unused code only after checking callers and side effects, within authorized scope.
- Prefer pure functions where useful. Preserve intentional side effects and public compatibility.

## Errors and diagnostics

- Handle errors at the appropriate boundary. Never silently swallow failures or add redundant catch/rethrow blocks to every async function.
- Distinguish expected outcomes from operational failures. Preserve causes where supported and provide safe user-facing messages.
- Log an operation name and allowlisted, redacted metadata. Never log raw input objects, credentials, tokens, passwords, or personal data. Avoid duplicate logging across layers.
- Use domain error types when callers need to distinguish them, rather than creating classes solely to satisfy a rule.

## Types and documentation

- Use useful types and validate untrusted data at runtime boundaries. Prefer `unknown` with narrowing to unchecked TypeScript `any`; explain unavoidable exceptions.
- Comments explain constraints or rationale established by evidence. Do not invent intent.
- Document public contracts, surprising behavior, units, and compatibility requirements. Avoid restating obvious types or documenting every trivial wrapper.
- Keep examples accurate. Mark pseudocode and incomplete excerpts explicitly. TODOs describe required work and, when useful, an issue reference.

## Security

- Keep secrets out of source, examples, logs, and handoffs. Use the environment or a secret manager appropriate to the runtime; privileged credentials stay server-side.
- Validate by contract; use parameterized queries and context-appropriate output encoding. Generic sanitization does not replace safe sinks or authorization.
- Enforce server-side authorization at relevant resource boundaries. Test denied and permitted access.
- Check dependency compatibility, provenance, maintenance, and known vulnerabilities before changes. Never claim an audit occurred unless performed.
- Review auth, permissions, data access, and sensitive-data changes before release. Test with disposable resources.

## Tests and completion

Use [verification](VERIFICATION.md) for commands and the [test writer](../agents/agent-testing.md) for test design. Add or update behavior checks in proportion to changed behavior and risk. Do not mandate tests for every helper or low-impact prose edit.

Work is complete when acceptance criteria are met, relevant checks have run, failures/skips are explained, and the diff contains no unrelated changes or secrets. Update affected public documentation and session state. Obtain independent review for sensitive or complex work; self-review does not establish independent approval. Never claim unexecuted checks passed.
