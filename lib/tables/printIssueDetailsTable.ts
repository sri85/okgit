import { LIST_ISSUE_HEADER } from "../tables/utils/pullRequestTableHeaders";
import { IssueDetailAction } from "../types";
import { getIssue, listIssues } from "../application/usecases/issues";
import { IssueDetails } from "../providers/contracts";
import { issueDetailsToRow } from "./mappers/issues";
import { renderTable } from "./utils/renderTable";

export async function printIssueDetailsTable(
    action: IssueDetailAction,
    issueId: number | string = ""
): Promise<void> {
    let results: IssueDetails[] = [];
    switch (action.toLowerCase()) {
        case "details": {
            const issue = await getIssue(issueId);
            results = issue === undefined ? [] : [issue];
            break;
        }
        case "list":
            results = await listIssues();
            break;
    }

    renderTable(LIST_ISSUE_HEADER, results, issueDetailsToRow);
}
