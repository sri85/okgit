import { GithubPR } from "../api/services/github/GitHubAPI";
export async function printPullRequestAddRemoveReviewersTable(
    prId,
    reviewerNames
) {
    await GithubPR.addReviewers(prId, reviewerNames);
    reviewerNames.map(name => console.log(`Added ${name} to ${prId}`));
}
