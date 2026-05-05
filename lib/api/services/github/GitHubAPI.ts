import createAPIBaseURL from "../../../utils/helpers";
import { GithubPullRequest } from "../github/pull_requests/GithubPullRequest";
import { GithubIssue } from "../github/issues/GithubIssue";
import { GithubRepo } from "./repos/GithubRepo";
import { FileConfigStore } from "../../../config/ConfigStore";
import { OkgitConfig } from "../../../types";
import { getConfigToken } from "../../../configManager/tokenConfig";

export function createGithubApis(config: OkgitConfig): {
    GithubPR: GithubPullRequest;
    GithubIssueAPI: GithubIssue;
    GithubRepoAPI: GithubRepo;
} {
    const baseURL =
        createAPIBaseURL(
            config.organization_username,
            config.hosting_provider_choice
        ) ?? "";
    const token = getConfigToken(config);

    return {
        GithubPR: new GithubPullRequest(baseURL, undefined, config.repo, token),
        GithubIssueAPI: new GithubIssue(baseURL, undefined, config.repo, token),
        GithubRepoAPI: new GithubRepo(
            baseURL,
            undefined,
            config.organization_username,
            token
        ),
    };
}

const githubApis = createGithubApis(new FileConfigStore().readConfig());

export const GithubPR = githubApis.GithubPR;
export const GithubIssueAPI = githubApis.GithubIssueAPI;
export const GithubRepoAPI = githubApis.GithubRepoAPI;
