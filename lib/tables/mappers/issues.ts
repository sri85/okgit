import { IssueDetails } from "../../providers/contracts";
import { DataRow } from "../../types";

export function issueDetailsToRow(issue: IssueDetails): DataRow {
    return [issue.url, issue.author, issue.state];
}
