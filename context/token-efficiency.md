# Context and token efficiency

Prompts, output, tool results, and supplied file contents consume context. File references select material conveniently; reading the contents still consumes tokens. Caching and billing vary by product/configuration, so brevity alone does not establish a specific cost saving.

## Keep useful context available

- State goals, acceptance criteria, constraints, and relevant paths concisely.
- With repository access, inspect source and callers using targeted searches/reads rather than pasting the repository. Preserve validation, authorization, and other contract boundaries when selecting excerpts.
- Load [project profile](PROJECT.md), [handoff](SESSION.md), and relevant standards through root [AGENTS.md](../AGENTS.md). `Codex.md` and arbitrary documents are not default automatic sources.
- Use file mentions only where supported. Otherwise name the path and explicitly request a read, or attach the material.
- Ask for concise summaries and verification evidence. Full replacement files suit copy/paste workflows; repository edits usually need only a summary and links.
- Keep unrelated tasks distinguishable. Start fresh when clarity benefits, carrying a verified handoff. A topic change alone does not require abandoning useful context.

## Long sessions

Context limits and compaction vary by model/interface. Do not assume a simple first-in-first-out dropping of old messages. Repeated questions and mistakes may indicate missing context but do not measure remaining capacity. Use exposed indicators when available, inspect current state, and re-establish relevant constraints.

Update [SESSION.md](SESSION.md) before handoff with repository state, verified results, blockers, and next steps. Preserve evidence and uncertainty while being concise. See [maintenance guidance](persistent-project-intelligence.md).

Choose an interface based on required file access, tools, permissions, and workflow, not an assumed universal Chat/Code/Cowork feature or token hierarchy. Check current official documentation for the actual interface.
