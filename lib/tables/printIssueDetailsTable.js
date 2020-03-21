import { GithubIssueAPI } from "../api/services/github/GitHubAPI";
import { LIST_ISSUE_HEADER } from "../tables/utils/pullRequestTableHeaders";
import createTable from "./utils/createTable";
import printTable from "./utils/printTable";
export async function printIssueDetailsTable(action, issueId) {
    let results;
    const resultsTable = createTable(LIST_ISSUE_HEADER);
    switch (action.toLowerCase()) {
        case "details":
            results = await GithubIssueAPI.getIssue(issueId);
            break;
        case "list":
            results = await GithubIssueAPI.getIssues();
            break;
    }

    for (let i = 0; i < results.length; i++) {
        resultsTable.push(results[i]);
    }
    printTable(resultsTable);
}
