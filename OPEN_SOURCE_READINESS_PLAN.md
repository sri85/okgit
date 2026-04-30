# Open Source Readiness Improvement Plan

This plan captures the next implementation work for improving `okgit` before open sourcing. The focus areas are maintainability, readability, extensibility, and security.

## Current Assessment

The codebase now has a clearer provider-first path:

```text
CLI command -> use case -> provider contract -> provider adapter -> provider mapper -> domain object -> table mapper -> renderer
```

The main remaining issue is inconsistency. Newer GitHub paths are cleaner, while older config, shell, auth, docs, and GitLab code still follow earlier patterns.

Approximate current scores:

| Area | Score | Summary |
| --- | ---: | --- |
| Maintainability | 6.5/10 | Better layering, but config globals and old facades remain. |
| Readability | 7/10 | Intent is clearer, but naming/docs are inconsistent. |
| Extensibility | 6.5/10 | Provider contracts help; provider-specific auth/config need work. |
| Security | 4.5/10 | Token storage, shell interpolation, and stale dependencies need attention. |

## Phase 1: Security Hardening

Security should be first because it affects user trust and open source adoption.

### Goals

- Remove command-injection risk from shell usage.
- Make config/token storage safer.
- Validate untrusted values before using them in URLs, shell commands, or file paths.
- Document minimum required token scopes.
- Reduce risk from stale dependencies.

### Tasks

1. Replace shell interpolation in browser opening.
   - Current file: `lib/tables/openLink.ts`
   - Replace `shell.exec(\`open ${link}\`)` with a safer cross-platform opener or child process call with argument arrays.
   - Validate `org`, `repo`, and IDs before constructing URLs.
   - Prefer `new URL()` for URL construction.

2. Replace shell interpolation in PR checkout.
   - Current file: `lib/tables/printCheckoutPR.ts`
   - Validate `prId` as a positive integer.
   - Use `child_process.execFile` or `spawn` with argument arrays:
     - `git fetch origin pull/<id>/head:pr-<id>`
     - `git checkout pr-<id>`
   - Handle non-zero exit codes explicitly.
   - Add tests for invalid PR IDs.

3. Replace `shell.sed` JSON editing.
   - Current file: `lib/programs/config/switchConfig.ts`
   - Parse `config.json`, update fields, and write JSON structurally.
   - Validate input format as `owner/repo`.
   - Reject missing owner or repo.
   - Add tests for valid and invalid switch inputs.

4. Harden config writes.
   - Current file: `lib/programs/config/createConfig.ts`
   - Use `fs.mkdirSync(configDir, { recursive: true, mode: 0o700 })`.
   - Write config with mode `0o600`.
   - Avoid `shell.echo(...).to(...)` for sensitive data.
   - Pretty-print JSON for readability, but never print the token.

5. Token safety and docs.
   - Rename internal typo `personnel_access_token` only if backward compatibility migration is included. Otherwise document it as legacy config key and introduce a new `personal_access_token` key with fallback.
   - Add README guidance for minimum GitHub token scopes.
   - Add warning that tokens are stored locally and should be treated as secrets.
   - Ensure `showConfig` redacts token values.

6. Dependency audit and upgrade plan.
   - Run `npm audit`.
   - Prioritize upgrades for:
     - `axios`
     - `commander`
     - `shelljs`
     - Babel packages if no longer needed
     - Mocha/Sinon/Nock stack
   - Keep dependency upgrades in small PRs because CLI output and tests may shift.

### Tests

- Unit tests for validators.
- Unit tests for config read/write permissions where practical.
- Unit tests for command argument arrays by stubbing child process helpers.
- Regression tests proving tokens are redacted.
- Existing checks:
  - `npm run typecheck`
  - `npm test`
  - `npm run lint`
  - `npm run build`

## Phase 2: Config Service Refactor

The current config module reads from disk at import time and exports globals. That makes behavior harder to test and reason about.

### Goals

- Replace import-time config globals with an explicit config service.
- Make config access injectable.
- Support safer future multi-profile config.
- Reduce hidden coupling between tests and `IS_TESTING`.

### Tasks

1. Introduce config domain types.
   - Create `lib/config/ConfigStore.ts` or similar.
   - Define:
     - `OkgitConfig`
     - `ConfigStore`
     - `ConfigReadError`
     - `ConfigValidationError`

2. Implement filesystem config store.
   - Reads from `~/.git-cli/config.json`.
   - Writes with secure permissions.
   - Exposes:
     - `readConfig()`
     - `writeConfig(config)`
     - `updateConfig(mutator)`
   - Avoid module-level file reads.

3. Add validation.
   - Validate provider.
   - Validate owner/org.
   - Validate repo.
   - Validate token presence for commands that need API access.
   - Validate template file names are derived from safe repo names.

4. Migrate providers to receive config.
   - `createGithubProvider(config)` should receive org, repo, token, and provider explicitly.
   - Remove provider construction from config globals.
   - Use cases should receive providers already configured.

5. Remove or shrink `lib/configManager/parseConfig.ts`.
   - Keep a temporary compatibility export if needed.
   - Mark it legacy internally.
   - Gradually move callers to the new config service.

6. Tests.
   - Use temp directories for config tests.
   - Avoid reading real home directory.
   - Remove reliance on `IS_TESTING` where possible.

### Tests

- Config read/write tests with temporary directories.
- Config migration tests for old `personnel_access_token`.
- Provider creation tests with explicit config objects.
- CLI command tests with fake config stores.

## Phase 3: Provider-Specific HTTP and Auth

`BaseAPI` currently assumes GitHub auth: `Authorization: token <token>`. GitLab and Bitbucket need different auth handling.

### Goals

- Make HTTP clients provider-aware.
- Keep auth logic out of domain adapters.
- Make it easy to add GitLab and Bitbucket providers without copying GitHub-specific behavior.

### Tasks

1. Introduce an HTTP client contract.
   - Example:
     ```ts
     interface HttpClient {
         get<T>(url: string): Promise<T>;
         post<T>(url: string, data?: RequestBody): Promise<T>;
         patch<T>(url: string, data?: RequestBody): Promise<T>;
         put<T>(url: string, data?: RequestBody, headers?: RequestHeaders): Promise<AxiosResponse<T>>;
         delete<T>(url: string, data?: RequestBody): Promise<T>;
     }
     ```

2. Create provider-specific client factories.
   - `createGitHubHttpClient(config)`
   - `createGitLabHttpClient(config)`
   - Later: `createBitbucketHttpClient(config)`

3. Move auth header creation into provider-specific code.
   - GitHub: `Authorization: token <token>` or modern `Bearer` if chosen.
   - GitLab: `PRIVATE-TOKEN` or `Authorization: Bearer`.
   - Bitbucket: likely bearer or basic/app-password flow.

4. Update GitHub adapter constructors.
   - Instead of extending `BaseAPI`, adapters can receive an `HttpClient`.
   - If done incrementally, `BaseAPI` can be wrapped first.

5. Normalize error handling.
   - Avoid every API method manually catching and printing.
   - Return typed result errors or throw typed provider errors.
   - Keep CLI rendering responsible for user-facing messages.

6. Tests.
   - Fake HTTP client tests for adapters.
   - Small Nock tests only for client/auth behavior.
   - Provider adapter tests should not need real Axios.

### Tests

- Auth header tests per provider.
- Adapter tests with fake HTTP client.
- Error mapping tests.
- Existing GitHub behavior regression tests.

## Phase 4: Readability and Documentation Refresh

The docs should accurately reflect the current architecture and command surface before open sourcing.

### Goals

- Make it easy for contributors to understand intent.
- Remove stale or misleading docs.
- Improve naming consistency.
- Add contribution guidance.

### Tasks

1. Rewrite `ARCHITECTURE.md`.
   - Remove stale Babel references and corrupted Mermaid text.
   - Document current TypeScript architecture.
   - Include the current flow:
     ```text
     CLI -> command module -> use case -> provider -> mapper -> renderer
     ```
   - Explain legacy shims and why they still exist.
   - Document provider contracts.

2. Refresh `README.md`.
   - Clearly state supported providers:
     - GitHub: supported.
     - GitLab: partial legacy merge-request command only, or unsupported in provider-first path.
     - Bitbucket: not implemented.
   - Update command list and aliases.
   - Add security/token scope section.
   - Add local development commands:
     - `npm run typecheck`
     - `npm test`
     - `npm run lint`
     - `npm run build`

3. Add `CONTRIBUTING.md`.
   - Project setup.
   - Test strategy.
   - Architecture overview.
   - How to add a provider.
   - How to add a command.
   - Coding style and expectations.

4. Naming cleanup.
   - Prefer `GitHub` in user-facing docs and `Github` only where existing class names make migration expensive.
   - Standardize `pullRequest` file names over `pullrequest` where practical.
   - Avoid broad rename churn unless tests are strong and imports are easy to update.

5. Error message cleanup.
   - Fix typos in `errorHandler`.
   - Standardize messages.
   - Remove emoji from error messages if targeting professional CLI expectations, or keep them consistently if brand voice requires it.

### Tests

- CLI help tests should be updated if command descriptions change.
- No heavy runtime tests required for docs, but run full checks.

## Phase 5: Provider Extensibility

Once config and HTTP are cleaner, extend the provider architecture beyond GitHub.

### Goals

- Make GitLab and Bitbucket additions predictable.
- Keep provider-specific response schemas/mappers isolated.
- Avoid leaking GitHub naming into generic code.

### Tasks

1. Define provider capability boundaries.
   - Pull requests vs merge requests:
     - Keep generic name as `PullRequestProvider`, or rename to `ChangeRequestProvider`.
     - Decide before adding GitLab deeply.
   - Issues.
   - Repositories.

2. Decide unsupported capability behavior.
   - If a provider does not support a capability, expose a typed unsupported error.
   - Do not return empty arrays for unsupported providers.

3. Move GitLab into provider-first structure.
   - `lib/providers/gitlab/provider.ts`
   - `lib/providers/gitlab/mappers/...`
   - `GitLabMergeRequestProvider` or generic change request mapping.

4. Add provider selection tests.
   - GitHub configured -> GitHub provider.
   - GitLab configured -> GitLab provider when implemented.
   - Bitbucket configured -> unsupported until implemented.

5. Add provider contract tests.
   - Shared behavior tests where possible.
   - Provider-specific adapter tests where API semantics differ.

### Tests

- Provider selection tests.
- GitLab mapper tests.
- GitLab adapter tests with fake HTTP/Nock.
- CLI tests for provider-specific unsupported messages.

## Phase 6: Test Suite Cleanup

The test suite is stronger now, but still has older broad adapter tests that mix transport, mapping, and compatibility.

### Goals

- Keep tests fast and clear.
- Reduce duplicated fixture assertions.
- Make failures point to the right layer.

### Tasks

1. Categorize tests by layer.
   - Mapper tests: pure data mapping.
   - Use-case tests: fake providers.
   - Renderer tests: table rows and output helpers.
   - Adapter tests: endpoint/method/auth/error behavior.
   - CLI tests: command/option registration and routing.

2. Reduce legacy shim test duplication.
   - Keep one compatibility test per legacy method group.
   - Move field-mapping detail to mapper tests.

3. Move nested tests into active glob or update test script.
   - Current script only runs `tests/unit/*.spec.ts`.
   - Either keep flat files or change to `tests/unit/**/*.spec.ts`.

4. Add command routing tests.
   - Prefer dependency-injected command registration where possible.
   - Avoid spawning CLI for every command because `ts-node` startup is slow.

5. Add security-focused tests.
   - Shell argument validation.
   - Config permission behavior.
   - Token redaction.

### Tests

- The test plan is the work here.
- Keep `npm test` under a reasonable time target.

## Recommended Execution Order

1. Security hardening.
2. Config service refactor.
3. Provider-specific HTTP/auth.
4. Documentation refresh.
5. Provider extensibility.
6. Test suite cleanup and consolidation.

This order reduces risk first, then improves the foundation for larger provider work.

## Definition of Done for Open Source Readiness

- `npm run typecheck`, `npm test`, `npm run lint`, and `npm run build` pass.
- README accurately describes supported providers and command surface.
- Architecture docs match the current code.
- Tokens are redacted in output and written with restrictive permissions.
- Shell commands use argument arrays and validate user-controlled input.
- Unsupported providers fail clearly.
- GitHub path is covered by mapper, use-case, renderer, adapter, and CLI tests.
- Contributor guide explains how to add a command or provider.
