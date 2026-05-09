# Adding GitHub Pages Sites

<INSTRUCTIONS>
- Primary goal: Maintain GitHub Pages repositories using the root-site plus separate project-site model.
- Root Pages site: The repo `andre-larsson.github.io` publishes at `https://andre-larsson.github.io/`.
- Project Pages sites: Each standalone site should usually live in its own repo, for example `andre-larsson/newpagename`, and publish at `https://andre-larsson.github.io/newpagename/`.
- Do not add new standalone Pages sites directly inside the `andre-larsson.github.io` repo unless the user explicitly asks for a page or section inside the root site itself.
- For Vite-based project Pages sites, set `base` to the repo path, for example `base: "/newpagename/"`.
- Configure GitHub Pages repos to deploy from GitHub Actions, not branch publishing. Use the Pages workflow with build output from `dist/` and `actions/deploy-pages@v4`.
- Treat deployment as part of completion for any Pages repo change: finish edits, run local verification such as `npm run build`, push, inspect the Actions run, and verify the live URL.
- If a new project site should be discoverable from the root site, deploy and verify the project repo first, then update `andre-larsson.github.io` with a link to `https://owner.github.io/repo/` and deploy that repo too.
- If a first Pages deploy fails with a 404, ensure Pages is enabled for the repo with `build_type=workflow`, then rerun the workflow.
- Do not commit local filesystem details, credentials, private keys, environment files, or machine-specific configuration.
- New React/Vite project-page skeleton workflow:
  - Create the site as its own repo unless the user explicitly asks for a section inside the root site.
  - Scaffold a minimal React app, for example with `npm create vite@latest . -- --template react`, then replace the starter UI with a small idea-specific page.
  - Set `vite.config.*` to use `base: "/<repo-name>/"` so the built assets resolve correctly at `https://andre-larsson.github.io/<repo-name>/`.
  - Ensure `package.json` includes clone-ready local-development scripts for `dev`, `build`, and `preview`, plus lint/test scripts when the scaffold provides them.
  - Commit `package.json` and the lockfile so another computer can continue with `git clone <repo-url>`, `npm install`, `npm run dev`, and `npm run build`.
  - Include a `.gitignore` suitable for Vite/Node projects, especially `node_modules/`, `dist/`, local env files, logs, and editor/OS noise.
  - Add a GitHub Pages workflow at `.github/workflows/pages.yml` that installs dependencies, runs `npm run build`, uploads `dist/`, and deploys with `actions/deploy-pages@v4`.
  - Create or connect the GitHub repo, push the initial skeleton, enable Pages with `build_type=workflow` if needed, inspect the Actions run, and verify the live project URL.
- Tests: Repo-specific; use each repository's own `AGENTS.md` and scripts when present.
</INSTRUCTIONS>
