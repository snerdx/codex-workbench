# Session workflow

1. **Orient:** Read [AGENTS.md](AGENTS.md), [project profile](context/PROJECT.md), and [handoff](context/SESSION.md). Inspect repository state and preserve existing work.
2. **Define success:** Establish the observable goal, acceptance criteria, constraints, and scope. Use [planning guidance](context/planning-approach.md) in proportion to risk.
3. **Establish a baseline:** Select checks from [verification](context/VERIFICATION.md). Record existing failures or missing setup.
4. **Implement:** Make focused changes and meaningful behavior tests. Select [existing roles](agents/README.md) when useful. Continue within existing authorization without repeated confirmation.
5. **Review and verify:** Inspect the diff, exercise failure cases, run relevant checks, and fix regressions. Record evidence and gaps. Sensitive or complex work needs independent review before release.
6. **Hand off:** Update session fields while retaining their instructions. Record branch/commit or Git unavailability, dirty state, exact results, blockers, decision links, and next actions. Commit, push, deploy, or perform external writes only when authorized.

See [the worked example](examples/README.md) for this workflow applied to a small refactor.
