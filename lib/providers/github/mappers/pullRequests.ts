import {
    GithubPullRequestCommentResponse,
    GithubPullRequestCommitResponse,
    GithubPullRequestDetailsResponse,
    GithubPullRequestFileResponse,
    GithubPullRequestListItem,
} from "../../../types";
import {
    PullRequestComment,
    PullRequestCommit,
    PullRequestFile,
    PullRequestListItem,
    PullRequestSummary,
} from "../../contracts";

export function mapGithubPullRequestListItem(
    response: GithubPullRequestListItem,
    state: string,
    formatDate: (dateString: string) => string
): PullRequestListItem {
    return {
        url: response.html_url,
        state,
        author: response.user.login,
        createdAt: formatDate(response.created_at),
    };
}

export function mapGithubPullRequestComment(
    response: GithubPullRequestCommentResponse
): PullRequestComment {
    return {
        author: response.user === null ? "Unknown User" : response.user.login,
        url: response.html_url,
    };
}

export function mapGithubPullRequestSummary(
    response: GithubPullRequestDetailsResponse
): PullRequestSummary {
    return {
        merged: response.merged,
        additions: response.additions,
        deletions: response.deletions,
        changedFiles: response.changed_files,
        mergeableState: response.mergeable_state,
        commits: response.commits,
        comments: response.comments,
        reviewComments: response.review_comments,
    };
}

export function mapGithubPullRequestCommit(
    response: GithubPullRequestCommitResponse
): PullRequestCommit {
    return {
        committer: response.commit.committer.name,
        message: response.commit.message,
        url: response.html_url,
    };
}

export function mapGithubPullRequestFile(
    response: GithubPullRequestFileResponse
): PullRequestFile {
    return {
        filename: response.filename,
        status: response.status,
        additions: response.additions,
        deletions: response.deletions,
        changes: response.changes,
    };
}
