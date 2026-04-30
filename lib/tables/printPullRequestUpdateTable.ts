import { updatePullRequestStatus } from "../application/usecases/pullRequests";
export async function printPullRequestUpdateTable(
    prId: number | string,
    state: string
): Promise<void> {
    await updatePullRequestStatus(prId, state);
    if (state === "closed") {
        console.log(`Updated the status of PR ${prId} to ${state} 🔒`);
    }
    if (state === "open") {
        console.log(`Updated the status of PR ${prId} to ${state} 🔓`);
    }
}
