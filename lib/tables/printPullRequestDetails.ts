import {
    PULL_REQUEST_COMMENTS_HEADER,
    PULL_REQUEST_DETAILS_HEADER,
    PULL_REQUEST_FILES_HEADER,
    PULL_REQUEST_COMMITS_HEADER,
} from "./utils/pullRequestTableHeaders";
import { PullRequestDetailAction } from "../types";
import {
    getPullRequestSummary,
    listPullRequestComments,
    listPullRequestCommits,
    listPullRequestFiles,
} from "../application/usecases/pullRequests";
import {
    pullRequestCommentToRow,
    pullRequestCommitToRow,
    pullRequestFileToRow,
    pullRequestSummaryToRow,
} from "./mappers/pullRequests";
import { renderTable } from "./utils/renderTable";

export async function printPullRequestDetails(
    action: PullRequestDetailAction,
    prId: number | string
): Promise<void> {
    switch (action.toLowerCase()) {
        case "commits":
            renderTable(
                PULL_REQUEST_COMMITS_HEADER,
                await listPullRequestCommits(prId),
                pullRequestCommitToRow,
                { printEmpty: false }
            );
            break;
        case "files":
            renderTable(
                PULL_REQUEST_FILES_HEADER,
                await listPullRequestFiles(prId),
                pullRequestFileToRow,
                { printEmpty: false }
            );
            break;
        case "summary": {
            const summary = await getPullRequestSummary(prId);
            renderTable(
                PULL_REQUEST_DETAILS_HEADER,
                summary === undefined ? [] : [summary],
                pullRequestSummaryToRow,
                { printEmpty: false }
            );
            break;
        }
        case "comments":
            renderTable(
                PULL_REQUEST_COMMENTS_HEADER,
                await listPullRequestComments(prId),
                pullRequestCommentToRow,
                { printEmpty: false }
            );
            break;
    }
}
