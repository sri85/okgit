import { GithubIssueAPI } from "../api/services/github/GitHubAPI";
import { LIST_ISSUE_HEADER } from "../tables/utils/pullRequestTableHeaders";
import createTable from "./utils/createTable";
import printTable from "./utils/printTable";
import { DataTable, IssueDetailAction } from "../types";

export async function printIssueDetailsTable(
    action: IssueDetailAction,
    issueId: number | string = ""
): Promise<void> {
    let results: DataTable = [];
    const resultsTable = createTable(LIST_ISSUE_HEADER);
    switch (action.toLowerCase()) {
        case "details":
            results = await GithubIssueAPI.getIssue(issueId);
            break;
        case "list":
            results = await GithubIssueAPI.getIssues();
            break;
    }

    for (const result of results) {
        resultsTable.push(result.map(String));
    }
    printTable(resultsTable);
}
