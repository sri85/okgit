import createTable from "./utils/createTable";
import printTable from "./utils/printTable";

import { GithubPR } from "../api/services/github/GitHubAPI";
import {
    PULL_REQUEST_COMMENTS_HEADER,
    PULL_REQUEST_DETAILS_HEADER,
    PULL_REQUEST_FILES_HEADER,
    PULL_REQUEST_COMMITS_HEADER,
} from "./utils/pullRequestTableHeaders";

export async function printPullRequestDetails(action, prId) {
    let resultsTable;
    let results;
    switch (action.toLowerCase()) {
        case "commits":
            resultsTable = createTable(PULL_REQUEST_COMMITS_HEADER);
            results = await GithubPR.showPullRequestCommits(prId);
            break;
        case "files":
            resultsTable = createTable(PULL_REQUEST_FILES_HEADER);
            results = await GithubPR.showPullRequestFiles(prId);
            break;
        case "summary":
            resultsTable = createTable(PULL_REQUEST_DETAILS_HEADER);
            results = await GithubPR.getPullRequest(prId);
            break;
        case "comments":
            resultsTable = createTable(PULL_REQUEST_COMMENTS_HEADER);
            results = await GithubPR.showPullRequestComments(prId);
            break;
    }

    if (results.length > 0) {
        for (let i = 0; i < results.length; i++) {
            resultsTable.push(results[i]);
        }
        printTable(resultsTable);
    }
}
