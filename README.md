# okgit

![Build](https://github.com/sri85/okgit/workflows/Node.js%20CI/badge.svg?branch=master) [![Node version](https://img.shields.io/node/v/okgit.svg?style=flat)](http://nodejs.org/download/) [![NPM Version](https://badge.fury.io/js/esta.svg?style=flat)](https://npmjs.org/package/okgit)

`okgit` is a command-line tool for working with hosted Git services from your terminal.

Current provider status:

| Provider | Status |
| --- | --- |
| GitHub | Supported for pull requests, issues, and repository operations. |
| GitLab | Partial legacy support for listing merge requests. |
| Bitbucket | Not implemented yet. |

## Installation

```bash
npm install okgit -g
```

`okgit` requires Node.js 18 or newer.

## Configuration

Run:

```bash
okgit config
```

The CLI prompts for:

- Hosting provider.
- Access token.
- Organization or username.
- Repository.
- Optional pull request template.
- Optional issue template.

Configuration is stored locally under `~/.git-cli/config.json`.

To switch the configured repository later:

```bash
okgit switchrepo owner/repo
```

To inspect the active config without printing tokens:

```bash
okgit showConfig
```

## Security

`okgit` stores your access token locally under `~/.git-cli/config.json`. Treat this file as a secret.

The CLI writes config files with restrictive permissions where supported by the operating system and redacts token values from normal config output.

For GitHub, prefer a fine-grained personal access token limited to the repositories you want to manage. Grant only the permissions needed for the commands you use:

- Pull request permissions for PR commands.
- Issue permissions for issue commands.
- Repository metadata permissions for repository details.
- Repository administration or security permissions only if enabling repository security settings.

## Commands

### Pull Requests

```bash
okgit fetchPR <repo> [state]
okgit pull-requests <repo> [state]
okgit createPR
okgit create-pr
okgit pr <id> --summary
okgit pr <id> --comments
okgit pr <id> --commits
okgit pr <id> --files
okgit pr <id> --state closed
okgit pr <id> --addReviewers alice,bob
okgit pr <id> --removeReviewers alice
okgit pr <id> --merge
okgit pr <id> --checkout
okgit pr <id> --web
```

### Issues

```bash
okgit create-issue
okgit list-issues
okgit issues
okgit issue <id> --details
okgit issue <id> --state closed
okgit issue <id> --assign alice,bob
okgit issue <id> --label bug,docs
okgit issue <id> --web
```

### Repositories

```bash
okgit repo-details <repo>
okgit repository-details <repo>
okgit create-repo
okgit repo <repoName> --star
okgit repo <repoName> --unstar
okgit repo <repoName> --enableScan
okgit openRepo
```

### GitLab Legacy

```bash
okgit fetchMR <repo> <state>
```

GitLab support is not yet wired into the provider-first architecture and should be treated as partial.

## Development

```bash
npm install
npm run typecheck
npm test
npm run lint
npm run build
```

The codebase is TypeScript and compiles to `dist`. The published binary points to `dist/cli.js`.

Architecture notes are in [ARCHITECTURE.md](./ARCHITECTURE.md), and contribution guidance is in [CONTRIBUTING.md](./CONTRIBUTING.md).

## Project Status

`okgit` is being prepared for broader open-source contribution. The current refactor direction is provider-first:

```text
CLI command -> use case -> provider contract -> provider adapter -> mapper -> renderer
```

Backward-compatible command names are kept while cleaner aliases are introduced.

## Release

The release process is not automated yet. Before publishing a new version, run the full validation suite and update release notes with user-facing command or behavior changes.
