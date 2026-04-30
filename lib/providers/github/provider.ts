import createAPIBaseURL from "../../utils/helpers";
import { org } from "../../configManager/parseConfig";
import { GithubIssue } from "../../api/services/github/issues/GithubIssue";
import { GithubPullRequest } from "../../api/services/github/pull_requests/GithubPullRequest";
import { GithubRepo } from "../../api/services/github/repos/GithubRepo";
import { OkgitProvider } from "../contracts";

export function createGithubProvider(): OkgitProvider {
    const baseURL = createAPIBaseURL(org, "github") ?? "";
    return {
        pullRequests: new GithubPullRequest(baseURL),
        issues: new GithubIssue(baseURL),
        repositories: new GithubRepo(baseURL),
    };
}
