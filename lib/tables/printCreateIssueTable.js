import { GithubIssueAPI } from "../api/services/github/GitHubAPI";
export async function printCreateIssueTable(issueTitle, issueBody) {
    console.log(await GithubIssueAPI.createIssue(issueTitle, issueBody));
}
