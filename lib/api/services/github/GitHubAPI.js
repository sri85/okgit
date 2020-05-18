import createAPIBaseURL from "../../../utils/helpers";
import { GithubPullRequest } from "../github/pull_requests/GithubPullRequest";
import { GithubIssue } from "../github/issues/GithubIssue";
import { GithubRepo } from "./repos/GithubRepo";
import { org, hosting_provider } from "../../../configManager/parseConfig";

export const GithubPR = new GithubPullRequest(
    createAPIBaseURL(org, hosting_provider)
);
export const GithubIssueAPI = new GithubIssue(
    createAPIBaseURL(org, hosting_provider)
);
export const GithubRepoAPI = new GithubRepo(
    createAPIBaseURL(org, hosting_provider)
);
