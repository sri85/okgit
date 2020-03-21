import { GithubPR } from "../api/services/github/GitHubAPI";
export async function printPullRequestRemoveReviewersTable(
    prId,
    reviewerNames
) {
    await GithubPR.removeReviewers(prId, reviewerNames);
    reviewerNames.map(name => console.log(`Removed ${name} to ${prId}`));
}
