import { mergePullRequest } from "../application/usecases/pullRequests";
export async function printPullRequestMergeTable(
    prId: number | string
): Promise<void> {
    await mergePullRequest(prId);
}
