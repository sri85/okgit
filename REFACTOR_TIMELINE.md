# okgit Refactor Timeline

## Perspective

This timeline is written from the perspective of an engineering manager revamping an existing side-project CLI into a codebase that is easier to maintain, safer to open source, and more approachable for future contributors.

Codex was used as an engineering partner throughout the effort: first to help plan and execute the TypeScript migration, then to evaluate architecture, propose refactors, implement focused changes, and keep verification tight after each slice.

## Starting Point

`okgit` began as a working Node.js CLI for interacting with hosted Git providers, primarily GitHub. The project already had useful product intent: reduce context switching by letting developers interact with pull requests, issues, and repositories from the terminal.

The challenge was not whether the tool had value. The challenge was whether the implementation was ready for broader contribution.

Before the refactor, the codebase had several common issues for an early-stage CLI:

- Runtime JavaScript with limited type safety.
- GitHub API logic mixed with table-shaped output.
- Commander command modules coupled directly to API classes and print helpers.
- Configuration read globally at import time.
- Provider messaging that mentioned GitLab and Bitbucket before the architecture was ready for them.
- Tests that mostly verified older behavior through HTTP mocks and table rows.
- Security gaps around token storage, shell command interpolation, and dependency age.

The working principle for the revamp was: preserve behavior first, improve structure second, and only then expand capability.

## Phase 1: TypeScript Migration

The first major decision was to migrate the project to strict TypeScript without changing the CLI framework or command behavior.

As the engineering manager, I treated this as a foundation investment. The goal was not to make the app feel different to users. The goal was to make future changes safer for maintainers.

Codex helped create and execute the migration plan captured in `TYPESCRIPT_MIGRATION_PLAN.md`.

Key decisions:

- Keep Commander for this phase.
- Use strict TypeScript.
- Avoid `any`; use `unknown` at external boundaries.
- Convert low-risk modules first.
- Preserve the published CLI path through `dist/cli.js`.
- Run typecheck, tests, lint, and build as the safety net.

Outcome:

- The project moved to TypeScript source files.
- Shared types were added for config, API responses, table rows, command options, and questionnaire answers.
- API service classes, table modules, CLI programs, and tests were converted.
- The repo gained a stronger baseline for future architectural work.

Representative commits from the branch:

- `feat: migrate project to strict typescript`
- `fix: handle malformed cli config`

## Phase 2: Architecture Evaluation

After TypeScript was in place, the next step was to evaluate the shape of the codebase.

The key finding was that the code worked, but the architecture still reflected its original implementation path. The GitHub classes were doing too much:

- Calling HTTP APIs.
- Validating GitHub responses.
- Mapping response data.
- Returning presentation-shaped table rows.
- In some cases printing directly.

That made future provider work harder. A GitLab or Bitbucket implementation would either need to copy GitHub-specific assumptions or contort itself into GitHub-shaped output.

The target architecture became provider-first:

```text
CLI command -> use case -> provider contract -> provider adapter -> provider mapper -> domain object -> table mapper -> renderer
```

The goal was not to introduce architecture for its own sake. The goal was to make intent visible:

- Providers return domain objects.
- Use cases coordinate application behavior.
- Renderers own human output.
- CLI modules register commands and parse options.

## Phase 3: Provider Contracts and GitHub Adapter

The first architecture slice introduced provider contracts for the major capabilities:

- Pull requests.
- Issues.
- Repositories.
- Config-selected provider access.

GitHub remained the first complete provider implementation.

Key changes:

- Added provider contracts under `lib/providers/contracts.ts`.
- Added a GitHub provider factory.
- Added configured provider selection.
- Kept existing GitHub API classes as the first provider adapters.
- Preserved legacy methods so existing behavior and tests did not break.

This was an important management tradeoff. We did not remove old methods immediately, because compatibility mattered. Instead, we added the new path and kept the old path as shims.

Outcome:

- Future provider work now has an explicit contract.
- GitHub behavior remained intact.
- Unsupported providers no longer silently fall back to GitHub.

## Phase 4: Use-Case Layer

Next, we added a thin application layer between Commander actions and providers.

Before this phase, command and table modules often reached directly into GitHub API singletons. That made command behavior harder to test without HTTP mocks and made provider substitution harder.

Key changes:

- Added use cases under `lib/application/usecases`.
- Moved provider delegation into use-case functions.
- Added injectable use-case factories for tests.
- Preserved existing production exports for command modules.

Codex helped keep this slice small: add the layer, point existing callers at it, and verify behavior before doing more.

Outcome:

- Application behavior can be tested with fake providers.
- CLI modules are less coupled to GitHub internals.
- Provider-first architecture became more than a set of types.

## Phase 5: Mapper Extraction

After use cases, we split mapping into two separate concerns.

Provider mappers convert external API responses into domain objects:

```text
GitHub response -> okgit domain object
```

Table mappers convert domain objects into human-facing table rows:

```text
domain object -> table row
```

Key changes:

- Added GitHub provider mappers for issues, pull requests, and repositories.
- Added table row mappers for issues, pull requests, and repositories.
- Updated GitHub adapters to use provider mappers.
- Updated legacy compatibility shims to use table mappers.

This was one of the most important readability improvements. It became much easier to answer, “Where does this field get renamed?” or “Where does table formatting happen?”

Outcome:

- API mapping is isolated and testable.
- Table formatting is isolated and testable.
- Legacy row methods no longer duplicate mapping logic.

## Phase 6: Table Rendering Cleanup

The table layer had repeated boilerplate:

- Create a `cli-table`.
- Push rows.
- Convert values to strings.
- Print the table.

We kept `cli-table` to avoid output churn, but introduced a generic renderer helper.

Key changes:

- Added `renderTable(headers, items, toRow)`.
- Preserved existing empty-output behavior:
  - Issue and repo views still print empty tables.
  - PR detail views still print nothing when no rows exist.
- Added tests for row mappers and rendering behavior.

Outcome:

- Table rendering became consistent.
- Table row conversion became easy to test.
- The project avoided unnecessary dependency churn.

## Phase 7: CLI Compatibility and Option Cleanup

The next slice focused on the command surface.

The goal was to improve naming without breaking users.

Key changes:

- Kept legacy commands:
  - `fetchPR`
  - `createPR`
  - `list-issues`
  - `repo-details`
- Added cleaner aliases:
  - `pull-requests`
  - `create-pr`
  - `issues`
  - `repository-details`
- Fixed duplicate `-s` behavior in `pr <id>`:
  - `--summary` is now long-only.
  - `-s` belongs to `--state`.
- Fixed `repo --enableScan` so it maps to the correct Commander option key.

Outcome:

- Existing users remain supported.
- New users get clearer command names.
- Previously confusing options are now covered by tests.

## Phase 8: Test Strategy Upgrade

The test suite evolved alongside the architecture.

Before the refactor, many tests used Nock to exercise GitHub classes and asserted table-shaped arrays. That was useful, but it mixed too many concerns in each test:

- HTTP path correctness.
- Auth headers.
- Response validation.
- Mapping.
- Table row shape.

The improved test strategy separates layers:

- Mapper tests for pure data conversion.
- Use-case tests with fake providers.
- Renderer tests for table behavior.
- CLI help tests for command and option registration.
- Adapter tests for HTTP behavior and compatibility.

Key changes:

- Added mapper tests.
- Added use-case tests.
- Added CLI help tests.
- Added renderer and table mapper tests.
- Re-enabled a previously pending PR list test by fixing stale expectations and making relative dates deterministic with a fake clock.

Outcome:

- The suite now better explains the intent of the architecture.
- Failures point to the right layer more often.
- The project has stronger regression protection for future contributors.

Current verification baseline after the refactor:

- `npm run typecheck`
- `npm test`
- `npm run lint`
- `npm run build`

At the time this timeline was written, the unit suite was passing with 82 tests.

## Phase 9: Open Source Readiness Assessment

Once the architecture was cleaner, we evaluated the codebase through four lenses:

- Maintainability.
- Readability.
- Extensibility.
- Security.

The assessment was captured in `OPEN_SOURCE_READINESS_PLAN.md`.

Summary scores:

| Area | Approximate Score | Reason |
| --- | ---: | --- |
| Maintainability | 6.5/10 | Better layering, but config globals and old facades remain. |
| Readability | 7/10 | Clearer intent, but naming and docs need cleanup. |
| Extensibility | 6.5/10 | Provider contracts are in place, but provider-specific auth/config needs work. |
| Security | 4.5/10 | Token storage, shell interpolation, and dependencies need attention. |

The most important finding was that security should come next before inviting outside users and contributors.

## Phase 10: Forward Plan

The remaining work is now clearer and can be executed as focused slices.

Recommended order:

1. Security hardening.
2. Config service refactor.
3. Provider-specific HTTP and auth.
4. Documentation refresh.
5. Provider extensibility.
6. Test suite cleanup and consolidation.

The intent is to keep each slice small enough to verify independently.

## Management Lessons

Several principles made the refactor safer:

1. Preserve behavior before changing architecture.
2. Add contracts before adding more providers.
3. Keep old commands as aliases rather than forcing a breaking cleanup.
4. Use tests to describe architectural intent, not just implementation details.
5. Separate API mapping from table rendering.
6. Treat security as a release-readiness concern, not a final polish task.

Codex was most useful as a pair-programming and review partner when the work was broken into well-scoped slices. It helped with repetitive refactors, test updates, and architectural consistency, while the engineering direction stayed anchored on product goals and open source maintainability.

## Current State

The project is not finished, but it is in a much better position than at the start of the TypeScript migration.

What is now true:

- The codebase is TypeScript-based.
- The provider-first architecture exists.
- GitHub is the first provider adapter.
- Domain mapping and table rendering are separated.
- Use cases can be tested without real HTTP.
- CLI aliases and option behavior are tested.
- Unsupported provider selection fails clearly.
- A concrete open-source readiness plan exists.

What remains:

- Harden shell and config handling.
- Improve token storage and redaction.
- Replace import-time config globals.
- Make HTTP/auth provider-specific.
- Refresh README and architecture docs.
- Decide the future shape of GitLab and Bitbucket support.

The refactor has moved `okgit` from “working CLI” toward “maintainable open-source project.” The next phase should focus on security and contributor trust.
