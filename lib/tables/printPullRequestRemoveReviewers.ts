import { GithubPR } from "../api/services/github/GitHubAPI";
export async function printPullRequestRemoveReviewersTable(
    prId: number | string,
    reviewerNames: string[]
): Promise<void> {
    await GithubPR.removeReviewers(prId, reviewerNames);
    reviewerNames.map(name => console.log(`Removed ${name} to ${prId}`));
}
