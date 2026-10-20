# Git standards

## Protect existing work

- Inspect status and relevant diffs before editing and staging. If Git is unavailable or this is not a repository, report the limitation; do not initialize one unless requested.
- Preserve user edits and unrelated work. Stage only intended files/hunks and inspect the staged diff for secrets and accidental changes.
- Do not reset, clean, force-push, rewrite shared history, delete branches, or discard changes without authorization. Verify branch, remote, and affected work first.
- Commit/push only when requested or covered by the agreed workflow. Editing files alone does not imply publishing them.
- Keep logically related changes together. A cohesive implementation and its tests belong together; unrelated cleanup does not.

## Conventional Commits

Use `<type>(<optional-scope>): <description>`. Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`, `revert`.

Use an imperative description, lowercase after the colon unless a proper name requires otherwise, no final period, and a subject at most 72 characters including its prefix. Explain rationale and compatibility in a body when needed; wrap prose near 72 characters. Reference actual issues only. Use `!` or a `BREAKING CHANGE:` footer when applicable.

```text
fix(auth): reject expired password reset tokens

Check expiry before consuming the token so an expired link cannot
change the account password. Add expiry-boundary regression coverage.
```

Do not invent tickets, results, or behavior. Avoid vague messages such as `fix stuff`. Use `refactor` only when observable behavior is preserved.

## Branches and hygiene

Use the project pattern, such as `feat/user-profile` or `fix/proj-123-session-timeout`. Project ticket casing may override lowercase preference.

Run relevant registered checks before committing. Separate baseline failures from regressions. Never bypass checks or claim a failing change passes. Deliberately failing regression tests or checkpoint commits need explicit agreement and clear labeling.

Do not commit secrets, real environment files, or ignored build outputs. Sanitized `.env.example` files with documented placeholders are appropriate when needed. Track generated artifacts only when the project requires them. Removing a secret from the latest diff does not remove historical exposure; flag the owner's rotation/history-remediation process without repeating the value.

Squash private fixups when team workflow calls for it. Do not rewrite shared history merely to improve style.
