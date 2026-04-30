import { GithubPR } from "../api/services/github/GitHubAPI";
export async function printPullRequestAddRemoveReviewersTable(
    prId: number | string,
    reviewerNames: string[]
): Promise<void> {
    await GithubPR.addReviewers(prId, reviewerNames);
    reviewerNames.map(name => console.log(`Added ${name} to ${prId}`));
}
