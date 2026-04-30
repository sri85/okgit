import Table from "cli-table";

export type HostingProvider =
    | "Github"
    | "Gitlab"
    | "Bitbucket"
    | "github"
    | "gitlab"
    | "bitbucket";

export interface OkgitConfig {
    repo: string;
    organization_username: string;
    personnel_access_token: string;
    hosting_provider_choice?: HostingProvider;
    pullRequestTemplate?: string;
    issueTemplate?: string;
}

export type TableCell = string | number | boolean;
export type DataRow = TableCell[];
export type DataTable = DataRow[];
export type StringTable = Table<string[]>;

export interface GithubUser {
    login: string;
}

export interface GithubIssueResponse {
    html_url: string;
    user: GithubUser;
    state: string;
}

export interface GithubPullRequestListItem {
    html_url: string;
    created_at: string;
    user: GithubUser;
}

export interface GithubPullRequestDetailsResponse {
    merged: boolean;
    additions: number;
    deletions: number;
    changed_files: number;
    mergeable_state: string;
    commits: number;
    comments: number;
    review_comments: number;
}

export interface GithubPullRequestCommentResponse {
    html_url: string;
    user: GithubUser | null;
}

export interface GithubPullRequestCommitResponse {
    html_url: string;
    commit: {
        committer: {
            name: string;
        };
        message: string;
    };
}

export interface GithubPullRequestFileResponse {
    filename: string;
    status: string;
    additions: number;
    deletions: number;
    changes: number;
}

export interface GithubPullRequestUpdateResponse {
    state: string;
}

export interface GithubReviewerResponse {
    login: string;
}

export interface GithubReviewersResponse {
    requested_reviewers: GithubReviewerResponse[];
}

export interface GithubMergePullRequestResponse {
    message: string;
}

export interface GithubCreatePullRequestResponse {
    html_url: string;
}

export interface GithubRepoResponse {
    full_name: string;
    html_url: string;
    ssh_url: string;
    forks: number;
    open_issues: number;
    stargazers_count: number;
    subscribers_count: number;
}

export interface GithubRepoCreateData {
    name: string;
    description: string;
    private: string;
    has_issues: string;
    has_projects: string;
    has_wiki: string;
    auto_init: string;
}

export interface GitlabProjectResponse {
    id: number;
    name: string;
}

export interface GitlabMergeRequestResponse {
    web_url: string;
    state: string;
    author: {
        name: string;
    };
    created_at: string;
}

export interface PullRequestQuestionnaireAnswers {
    remote_branch: string;
    current_branch: string;
    title: string;
    description: string;
}

export interface IssueQuestionnaireAnswers {
    issue_title: string;
    issue_body: string;
}

export interface CreateRepoQuestionnaireAnswers {
    repo_title: string;
    repo_description: string;
    is_private: "yes" | "no";
    repo_has_projects: "yes" | "no";
    repo_has_issues: "yes" | "no";
    repo_has_wiki?: "yes" | "no";
    repo_auto_init: "yes" | "no";
}

export interface SwitchConfigAnswers {
    organization_username: string;
}

export type PullRequestDetailAction =
    | "commits"
    | "files"
    | "summary"
    | "comments";
export type IssueDetailAction = "details" | "list";
export type IssueUpdateAction = "close" | "assign" | "label";
export type RepoDetailsAction = "list" | "create";
export type RepoUpdateAction = "star" | "unstar" | "enable";
export type OpenLinkAction = "pr" | "issue" | "repo";

export interface PullRequestCommandOptions {
    comments?: boolean;
    commits?: boolean;
    summary?: boolean;
    files?: boolean;
    state?: string;
    addReviewers?: string;
    removeReviewers?: string;
    merge?: boolean;
    checkout?: boolean;
    web?: boolean;
}

export interface IssueCommandOptions {
    state?: string;
    details?: boolean;
    assign?: string;
    label?: string;
    web?: boolean;
}

export interface RepoCommandOptions {
    star?: boolean;
    unstar?: boolean;
    enableScan?: boolean;
}
