import clc from "cli-color";
import {
    PullRequestComment,
    PullRequestCommit,
    PullRequestFile,
    PullRequestSummary,
} from "../../providers/contracts";
import { DataRow } from "../../types";

export function pullRequestCommentToRow(
    comment: PullRequestComment
): DataRow {
    return [comment.author, comment.url];
}

export function pullRequestCommitToRow(commit: PullRequestCommit): DataRow {
    return [commit.committer, commit.message, commit.url];
}

export function pullRequestFileToRow(file: PullRequestFile): DataRow {
    return [
        file.filename,
        file.status,
        `${clc.green(file.additions)}`,
        `${clc.red(file.deletions)}`,
        file.status,
        `${file.changes}`,
    ];
}

export function pullRequestSummaryToRow(
    summary: PullRequestSummary
): DataRow {
    return [
        summary.merged,
        summary.additions,
        summary.deletions,
        summary.changedFiles,
        summary.mergeableState,
        summary.commits,
        summary.comments,
        summary.reviewComments,
    ];
}
