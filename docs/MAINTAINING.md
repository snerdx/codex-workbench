# Maintaining this toolkit

Developer onboarding lives in the [quick start](../README.md). Shared workflows live under skills. Project assets bundled with kit-project-init are templates; context/SESSION.md is also kept clean. Maintenance run history belongs in release notes, never distributed session fields.

## Checks

From this toolkit directory, use Node.js 20+:

```sh
node scripts/validate-kit.mjs
node --test tests/toolkit.test.mjs
```

No dependency installation is required. The package validator checks only files listed in kit-manifest.json. Add new package files explicitly to that manifest and keep its version aligned with plugin.json. It checks required file presence, skill metadata shape, supported local link destinations, JavaScript syntax, and the worked example. It does not audit application repositories, assert instruction compliance, contact remote URLs, validate heading anchors, or enforce organization policy.

The lightweight Markdown checker supports inline links (including titles, angle destinations and ordinary parentheses), reference-style links, backtick/tilde fences, and javascript/js/mjs/cjs labels. It is not a complete CommonMark renderer. JS examples default to module syntax; use `cjs` or `javascript script` for CommonJS syntax and label deliberately incomplete code `javascript fragment` to exclude it explicitly. Syntax checks never execute snippets. The example is executed separately with a timeout.

## Skill maintenance

Keep SKILL.md descriptions discriminating. Put detailed procedures in each skill's references and setup assets in the init skill so both plugin and repository distributions are self-contained. The old agents/agent-* paths are migration pointers, not second sources of instructions.

When available, run the system skill-creator's `scripts/quick_validate.py <skill-directory>` for each skill. Its frontmatter checks supplement package validation, but neither establishes model behavior. Evaluate realistic tasks using [the scenarios](../evals/scenarios.md).

The project installer skips identical files, rejects conflicts before writes, and checks receipt ownership for updates. It does not promise transactional rollback after an unexpected filesystem failure. Test paths with spaces, existing root instructions, custom skills, dry runs, and repeated setup when changing installer behavior.

## Release records

See [CHANGELOG.md](../CHANGELOG.md). Record actual check results and limitations in the release process. Plugin-host discovery and behavioral model evaluations require separate execution. The original toolkit is licensed under [MIT](../LICENSE). Keep bundled skill and template LICENSE files identical to the root notice, and preserve any separately licensed third-party notices.

The bundled .github/workflows/kit-checks.yml runs source checks on Linux and Windows when this toolkit directory is the Git repository root. It is not installed into applications. Application CI commands and protected-branch requirements remain team configuration. CI execution is not implied by a local test pass.
