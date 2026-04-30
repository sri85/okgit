import { addPullRequestReviewers } from "../application/usecases/pullRequests";
export async function printPullRequestAddRemoveReviewersTable(
    prId: number | string,
    reviewerNames: string[]
): Promise<void> {
    await addPullRequestReviewers(prId, reviewerNames);
    reviewerNames.map(name => console.log(`Added ${name} to ${prId}`));
}
