# TypeScript Migration Plan

## Goal

Convert `okgit` to a strict TypeScript project while keeping the existing Commander-based CLI framework and preserving current command behavior.

## Constraints

-   Keep Commander; do not migrate to oclif, Clipanion, Yargs, or another CLI framework in this phase.
-   Use strict TypeScript.
-   Do not use `any`.
-   Use `unknown` at external boundaries and narrow explicitly.
-   Work in red-green-refactor slices, running tests and linting as the migration progresses.
-   Keep published CLI behavior through `dist/cli.js`.

## Plan

1. Create the `typescript-migration` branch.
2. Capture this plan in `TYPESCRIPT_MIGRATION_PLAN.md`.
3. Run the current baseline checks:
    - `npm test`
    - `npm run lint`
    - `npm run prettier`
    - `npm run build`
4. Add TypeScript tooling and strict compiler configuration.
5. Add shared project types for config, API rows, provider names, API payloads, command options, and questionnaire answers.
6. Convert low-risk utility modules first:
    - constants
    - helpers
    - schema validation helper
    - table utilities
7. Convert configuration and parser modules.
8. Convert API service classes:
    - `BaseAPI`
    - GitHub pull requests
    - GitHub issues
    - GitHub repositories
    - GitLab merge requests
9. Convert table printer modules.
10. Convert questionnaire and Commander program modules.
11. Convert the CLI entrypoint and executable wrapper.
12. Update build, lint, and test scripts for TypeScript.
13. Convert or adapt tests so they run against TypeScript source or compiled output.
14. Run final verification:
    - `npm test`
    - `npm run lint`
    - `npm run prettier`
    - `npm run build`
    - `npm run typecheck`
15. Commit the migration changes on `typescript-migration`.

## Framework Decision

For this phase, the CLI framework remains Commander. A future framework migration can be considered separately:

-   oclif: best if the project needs a full CLI platform with plugin support and generated docs.
-   Clipanion: best if the project wants strongly typed command definitions with less platform weight.

Those are intentionally out of scope for this migration.
