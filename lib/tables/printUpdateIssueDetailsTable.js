import { GithubIssueAPI } from "../api/services/github/GitHubAPI";
import printTable from "./utils/printTable";

export async function printUpdateIssueDetailsTable(action, issueId, data) {
    let updateMessage;
    await GithubIssueAPI.updateIssue(action, issueId, data);
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
