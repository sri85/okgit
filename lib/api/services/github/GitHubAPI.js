import createAPIBaseURL from "../../../utils/helpers";
import { GithubPullRequest } from "../github/pull_requests/GithubPullRequest";
import { GithubIssue } from "../github/issues/GithubIssue";
import { GithubRepo } from "./repos/GithubRepo";
import { org } from "../../../configManager/parseConfig";

export const GithubPR = new GithubPullRequest(createAPIBaseURL(org));
export const GithubIssueAPI = new GithubIssue(createAPIBaseURL(org));
export const GithubRepoAPI = new GithubRepo(createAPIBaseURL(org));
