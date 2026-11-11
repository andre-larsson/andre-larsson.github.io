# Adding GitHub Pages Sites

<INSTRUCTIONS>
- Primary goal: Maintain GitHub Pages repositories using the root-site plus separate project-site model.
- Step-by-step commands and checks: the `add-pages-site` skill, when it is installed. These rules are the summary.
- Account: use the personal `andre-larsson` GitHub account, never a work organization.
- Root Pages site: The repo `andre-larsson.github.io` publishes at `https://a403.space/`, a custom domain. `https://andre-larsson.github.io/` redirects there.
- Project Pages sites: Each standalone site lives in its own repo, for example `andre-larsson/newpagename`, and publishes at `https://a403.space/newpagename/`. The repo name is the URL path, so keep it short, lowercase and hyphenated.
- Do not add new standalone Pages sites directly inside the `andre-larsson.github.io` repo unless the user explicitly asks for a page or section inside the root site itself. Keep the root site a lightweight launcher.
- For Vite-based project Pages sites, set `base` to the repo path, for example `base: "/newpagename/"`. Do not write root paths such as `"/icon.svg"` in code, because Vite adds the base only to `index.html` and imported assets. Import the file or use `import.meta.env.BASE_URL`.
- Deploy GitHub Pages repos from GitHub Actions, not branch publishing: build, upload the output folder with `actions/upload-pages-artifact`, and deploy it with `actions/deploy-pages`. Use current releases of the actions.
- Enable Pages for a new repo before its first push: `gh api -X POST repos/andre-larsson/<repo>/pages -f build_type=workflow`. If a first deploy fails with a 404, enable Pages that way, then rerun the workflow.
- Treat deployment as part of completion for any Pages repo change: finish edits, run local verification such as `npm run build`, push to `main`, inspect the Actions run, and verify the live URL.
- To make a new project site discoverable from the root site, deploy and verify the project repo first. Then add one entry (its `slug`, `title` and one-sentence `description`) to the right group in `src/projects.js` in this repo, and deploy this repo too. Never link a site that is not live yet.
- Do not commit local filesystem details, credentials, private keys, environment files, or machine-specific configuration.
- New React/Vite project-site skeleton workflow:
  - Create the site as its own repo unless the user explicitly asks for a section inside the root site.
  - Scaffold without prompts: `npm create vite@latest . -- --template react --eslint --no-interactive --no-immediate`. `--eslint` keeps ESLint, which the other sites use; create-vite 9 and later default to Oxlint. Replace the starter UI with a small idea-specific page, and delete unused starter assets.
  - Set `vite.config.*` to use `base: "/<repo-name>/"` so the built assets resolve at `https://a403.space/<repo-name>/`.
  - Keep the `dev`, `build`, `preview`, and `lint` scripts in `package.json`. Commit `package.json` and the lockfile so another computer can continue with `git clone <repo-url>`, `npm install`, `npm run dev`, and `npm run build`.
  - Use a `.gitignore` suitable for Vite/Node projects: `node_modules/`, `dist/`, env files, logs, and editor/OS noise. The scaffold's file does not ignore env files, so add `.env`, `.env.*` and `!.env.example`.
  - Add `.github/workflows/pages.yml` that runs `npm ci`, `npm run lint` and `npm run build`, uploads `dist/`, and deploys with `actions/deploy-pages` on push to `main`.
  - Add a short `AGENTS.md` in the same format as this repo's, and replace the Vite `README.md` with a short one that gives the live URL and the npm commands.
  - Create the GitHub repo, enable Pages with `build_type=workflow`, push the initial skeleton, inspect the Actions run, and verify the live project URL.
- Tests: Repo-specific; use each repository's own `AGENTS.md` and scripts when present.
</INSTRUCTIONS>
