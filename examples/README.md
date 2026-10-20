# Worked example: preserve an authorization predicate

This miniature walkthrough demonstrates the workflow without choosing an application stack. It uses ordinary in-memory records and no external side effects. Requires Node.js 20+ with no packages.

## Goal and plan

Simplify an active-admin predicate while preserving its contract: return a boolean; permit only `isActive === true` with role `admin` or `superadmin`; reject missing records and truthy non-boolean active values. Non-goals include changing policy or handling objects with observable getters.

Inspect [active-admin.mjs](active-admin.mjs). It contains the baseline, original defective simplification, corrected implementation, and executable checks. Plan: preserve strict equality, exercise representative inputs, compare baseline/corrected outcomes, then inspect the diff.

## Review and regression

The defective version returns `undefined` for `null` and permits `{ isActive: 'yes', role: 'admin' }`. The checks establish those defects and require the corrected predicate to match the expected boolean and baseline on every case. This finite regression suite does not prove equivalence for arbitrary JavaScript objects.

The testing role can maintain cases, the reviewer can inspect preserved comparisons/types, and the documentation role can explain the contract. Applying roles in one session is self-review unless a separate reviewer actually participates.

## Run

From the kit root:

```sh
node examples/active-admin.mjs
node scripts/validate-kit.mjs
```

The first exits nonzero on assertion failure and otherwise prints the passing contract-case count. The second also validates kit structure and links. These are expected outcomes; run the commands before recording a result in your environment.

## Handoff

Update [SESSION.md](../context/SESSION.md) with actual time, Git state or unavailability, changed files, exact results, limits, and next action. Record the strict-boolean contract in the project profile if it becomes a lasting application decision. Never copy fabricated commit hashes or results into a handoff.
