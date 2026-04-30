import { removePullRequestReviewers } from "../application/usecases/pullRequests";
export async function printPullRequestRemoveReviewersTable(
    prId: number | string,
    reviewerNames: string[]
): Promise<void> {
    await removePullRequestReviewers(prId, reviewerNames);
    reviewerNames.map(name => console.log(`Removed ${name} to ${prId}`));
}
