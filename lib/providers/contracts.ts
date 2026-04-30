import { AxiosResponse } from "axios";
import { GithubRepoCreateData, IssueUpdateAction, RepoUpdateAction } from "../types";

export interface PullRequestListItem {
    url: string;
    state: string;
    author: string;
    createdAt: string;
}

export interface PullRequestSummary {
    merged: boolean;
    additions: number;
    deletions: number;
    changedFiles: number;
    mergeableState: string;
    commits: number;
    comments: number;
    reviewComments: number;
}

export interface PullRequestComment {
    author: string;
    url: string;
}

export interface PullRequestCommit {
    committer: string;
    message: string;
    url: string;
}

export interface PullRequestFile {
    filename: string;
    status: string;
    additions: number;
    deletions: number;
    changes: number;
}

export interface PullRequestMergeResult {
    status: number;
    message: string;
}

export interface PullRequestProvider {
    createPullRequest(
        title: string,
        currentBranchName: string,
        baseBranchName: string,
        body: string
    ): Promise<string>;
    listPullRequests(
        repoName: string,
        state: string | undefined
    ): Promise<PullRequestListItem[]>;
    getPullRequestSummary(id: number | string): Promise<PullRequestSummary | undefined>;
    listPullRequestComments(id: number | string): Promise<PullRequestComment[]>;
    listPullRequestCommits(id: number | string): Promise<PullRequestCommit[]>;
    listPullRequestFiles(id: number | string): Promise<PullRequestFile[]>;
    updatePullRequestStatus(id: number | string, state: string): Promise<string>;
    addReviewers(id: number | string, reviewerNames: string[]): Promise<string[]>;
    removeReviewers(id: number | string, reviewerNames: string[]): Promise<string[]>;
    mergePullRequest(id: number | string): Promise<PullRequestMergeResult | undefined>;
}

export interface IssueDetails {
    url: string;
    author: string;
    state: string;
}

export interface IssueProvider {
    createIssue(issueTitle: string, issueBody: string): Promise<string>;
    getIssueDetails(issueId: number | string): Promise<IssueDetails | undefined>;
    listIssues(): Promise<IssueDetails[]>;
    updateIssue(
        action: IssueUpdateAction,
        issueNumber: number | string,
        data: string | string[]
    ): Promise<string>;
}

export interface RepositoryDetails {
    fullName: string;
    url: string;
    sshUrl: string;
    forks: number;
    openIssues: number;
    stars: number;
    subscribers: number;
}

export interface RepositoryProvider {
    getRepositoryDetails(repoName: string): Promise<RepositoryDetails | undefined>;
    createRepository(repoData: GithubRepoCreateData): Promise<RepositoryDetails | undefined>;
    toggleStarUnstarRepo(
        repoName: string,
        action: Exclude<RepoUpdateAction, "enable">
    ): Promise<number | undefined>;
    enableVulnerabilityScan(
        action: Extract<RepoUpdateAction, "enable">,
        repoName: string
    ): Promise<AxiosResponse<unknown> | undefined>;
}

export interface OkgitProvider {
    pullRequests: PullRequestProvider;
    issues: IssueProvider;
    repositories: RepositoryProvider;
}
