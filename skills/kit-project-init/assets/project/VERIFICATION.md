# Project verification

The machine-readable registry is [verification.json](verification.json). It owns approved command strings and current baseline status. This document explains prerequisites, fixtures, environment needs, and known gaps. Never place credential values in either file.

Inspect manifests, script definitions, and lockfiles before approving commands. Record each applicable check with name, command, cwd relative to project root, approved flag, status (passed/failed/not run), and reason for failures/skips. Run appropriate baseline checks under current authorization; installation itself executes none. Commands may have external or destructive side effects, even if their names look harmless.

Use unit checks for changed contracts, integration checks for service/data boundaries, and end-to-end checks for critical user journeys. Add accessibility, security, and performance checks when relevant. Use disposable resources and clean up only owned test data. Keep secrets out of output. Do not claim generated tests ran.

Record securityReview as confirmed only after a developer/administrator checks actual Codex permissions, production access, CI checks, branch protections, and review requirements. Record discoveryConfirmed only after the skills and project instructions are observed in the actual target Codex session. These are attestations; the readiness script does not independently verify enforcement or execute application commands.

Baseline/environment details: Not recorded. Missing checks must remain explicit, with a reason and next action.
