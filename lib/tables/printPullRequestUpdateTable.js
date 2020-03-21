import { GithubPR } from "../api/services/github/GitHubAPI";
export async function printPullRequestUpdateTable(prId, state) {
    await GithubPR.updatePullRequestStatus(prId, state);
    console.log(`Updated the status of ${prId} to ${state}`);
}
