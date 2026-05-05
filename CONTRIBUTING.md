# Contributing to okgit

Thanks for helping improve `okgit`. The project is being refactored toward a provider-first TypeScript architecture, so contributions should keep behavior compatible while making intent clearer.

## Setup

```bash
npm install
npm run typecheck
npm test
npm run lint
npm run build
```

The CLI is compiled into `dist`, and the package binary points to `dist/cli.js`.

## Architecture

New work should follow this flow:

```text
CLI command -> program module -> use case -> provider contract -> provider adapter -> mapper -> domain object -> table mapper -> renderer
```

Useful files:

-   `lib/cli.ts` registers commands.
-   `lib/programs` contains command modules and prompts.
-   `lib/application/usecases` delegates command behavior to providers.
-   `lib/providers/contracts.ts` defines provider contracts and domain objects.
-   `lib/providers/github` contains GitHub provider wiring and response mappers.
-   `lib/api` contains HTTP clients, auth headers, provider errors, and legacy API services.
-   `lib/tables` contains human-readable table and text output.

Read [ARCHITECTURE.md](./ARCHITECTURE.md) before large changes.

## Compatibility

Keep existing commands working unless a major-version migration plan exists.

Examples of legacy commands that must continue to work:

-   `fetchPR`
-   `createPR`
-   `list-issues`
-   `repo-details`
-   `showConfig`

Cleaner aliases can be added beside older names, but do not remove old command names in normal feature work.

## Provider Guidelines

Provider adapters should:

-   Receive config or an injected `HttpClient`; avoid importing config globals in new code.
-   Return typed domain objects from `lib/providers/contracts.ts`.
-   Use provider-specific auth/header factories.
-   Use provider mappers to translate API responses to domain objects.
-   Avoid printing directly.

Rendering belongs in `lib/tables`. API adapters should not know about `cli-table`.

## Testing Guidelines

Prefer the smallest test that covers the behavior:

-   Mapper tests use static API-like fixtures.
-   Adapter tests use fake `HttpClient` implementations.
-   HTTP/auth tests verify provider-specific headers and base URLs.
-   CLI tests verify command aliases and options.
-   Config tests use temporary directories.
-   Nock tests are still useful for legacy Axios integration behavior.

Run the full checks before submitting a change:

```bash
npm run typecheck
npm test
npm run lint
npm run build
```

## Security Guidelines

Treat tokens as secrets.

-   Do not print access tokens.
-   Do not add logs containing config values unless tokens are redacted.
-   Validate user-controlled values before using them in URLs, file paths, or subprocess arguments.
-   Use structured file writes for JSON config.
-   Use `execFile` or argument-array process helpers instead of shell interpolation.

## Adding a Command

1. Add provider contract behavior if the command needs API data.
2. Implement or extend the provider adapter.
3. Map API responses into domain objects.
4. Add a use case in `lib/application/usecases`.
5. Add rendering in `lib/tables`.
6. Register the command in `lib/programs` and `lib/cli.ts`.
7. Add focused tests for the changed layers.

## Adding a Provider

1. Add provider-specific auth and HTTP client factory.
2. Implement provider adapters for the relevant contracts.
3. Add provider response mappers.
4. Update provider selection in `lib/providers/index.ts`.
5. Add fake-client adapter tests and mapper tests.
6. Document support status in `README.md`.

## Style

-   Keep changes scoped to the requested behavior.
-   Prefer existing patterns over new abstractions.
-   Add abstractions only when they remove real duplication or clarify ownership.
-   Use clear names over comments where possible.
-   Add comments only for non-obvious logic.
