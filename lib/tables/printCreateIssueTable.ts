import { GithubIssueAPI } from "../api/services/github/GitHubAPI";
export async function printCreateIssueTable(
    issueTitle: string,
    issueBody: string
): Promise<void> {
    console.log(await GithubIssueAPI.createIssue(issueTitle, issueBody));
}
