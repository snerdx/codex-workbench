# Reproduce the CLI demonstration

The README demonstration is a rendering of actual helper stdout, not a screenshot of a live Codex session. It exercises the installer preview, installation, and readiness helper against a new disposable project. Setup is intentionally incomplete, so readiness exits with status 1. No application tests are run.

From the toolkit root with Node.js 20 or later:

```sh
node scripts/capture-demo.mjs
```

The script creates a temporary directory, asserts that preview writes nothing, installs the toolkit, captures readiness output, and removes only its own temporary fixture. It writes [full output](../assets/demo-output.json) and [the SVG rendering](../assets/installation-demo.svg). The captured commands display a relative example path in place of the actual temporary directory. SVG file-operation lists are explicitly abbreviated; the JSON retains complete stdout and exit statuses. Script bodies and credentials are not read from a real application.

Review both generated files after recapturing. Platform and Node version can change the capture metadata. The [banner](../assets/workbench-banner.svg) is a separate original vector illustration, not a product screenshot or official OpenAI asset.
