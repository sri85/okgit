import printTable from "./utils/printTable";
import { IssueUpdateAction } from "../types";
import { updateIssue } from "../application/usecases/issues";

export async function printUpdateIssueDetailsTable(
    action: IssueUpdateAction,
    issueId: number | string,
    data: string | string[]
): Promise<void> {
    let updateMessage = "";
    await updateIssue(action, issueId, data);
    switch (action.toLowerCase()) {
        case "close":
            updateMessage = `${data}d issue ${issueId}`;
            break;
        case "assign":
            updateMessage = `Assigned  ${issueId} to ${data}`;
            break;
        case "label":
            updateMessage = `Added Labels ${data} to ${issueId}`;
    }

    printTable(updateMessage);
}
