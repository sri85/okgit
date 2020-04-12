import { GithubPR } from "../api/services/github/GitHubAPI";
export async function printPullRequestUpdateTable(prId, state) {
    await GithubPR.updatePullRequestStatus(prId, state);
    if (state === "closed") {
        console.log(`Updated the status of PR ${prId} to ${state} 🔒`);
    }
    if (state === "open") {
        console.log(`Updated the status of PR ${prId} to ${state} 🔓`);
    }
}
