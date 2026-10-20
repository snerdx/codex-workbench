# Planning approach

Plan in proportion to uncertainty, risk, and coordination needs. Inspect relevant source and tests before proposing changes. Routine understood work can proceed with a brief internal plan; touching two files alone does not require a separate planning conversation.

Use a written plan for ambiguous features, API/data-model changes, auth changes, risky migrations, or multi-session work. Continue through an agreed plan without repeated approval. Ask when a material unanswered question or authorization boundary blocks progress.

## Planning prompt

```text
Inspect relevant implementation and tests before choosing an approach.
Goal: [observable outcome and intended users]
Acceptance criteria: [specific behavior and failure cases]
Constraints: [compatibility, security, performance, scope, environments]
Compare approaches only where meaningful tradeoffs exist. Recommend one.
List affected files, steps, checks, risks, and recovery where relevant.
State unknowns. Proceed with authorized reversible work; ask about
unresolved decisions that materially affect the result.
```

Do not force alternatives when one approach is clearly suitable. Check installed library versions and interfaces. Separate facts, assumptions, and decisions.

## Written plan and execution

Record goal, acceptance criteria, non-goals, modules, ordered steps, dependencies, [verification commands](VERIFICATION.md), and material risks. Include compatibility and recovery for persistent-data changes. Track status and blockers. Save long-lived plans at an agreed path linked from [SESSION.md](SESSION.md).

Implement in reviewable increments, inspect callers, and check changed behavior. Update plans when evidence changes them; seek a decision only when scope or authorization changes. Review the diff and report results. Record state and exact next action in the handoff. See [session workflow](../SESSION-OUTLINE.md).
