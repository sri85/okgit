import { GithubIssue } from "../../api/services/github/issues/GithubIssue";
import { GithubPullRequest } from "../../api/services/github/pull_requests/GithubPullRequest";
import { GithubRepo } from "../../api/services/github/repos/GithubRepo";
import { OkgitProvider } from "../contracts";
import { OkgitConfig } from "../../types";
import { createGitHubHttpClient } from "../../api/providerHttpClients";

export function createGithubProvider(config: OkgitConfig): OkgitProvider {
    const httpClient = createGitHubHttpClient(config);
    return {
        pullRequests: GithubPullRequest.fromHttpClient(config.repo, httpClient),
        issues: GithubIssue.fromHttpClient(config.repo, httpClient),
        repositories: GithubRepo.fromHttpClient(
            config.organization_username,
            httpClient
        ),
    };
}
