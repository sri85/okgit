import { execFileAsync, ExecFileRunner } from "../utils/execFile";
import { parsePositiveIntegerId } from "../utils/validators";

export async function checkoutPullRequest(
    prId: number | string,
    runner: ExecFileRunner = execFileAsync
): Promise<void> {
    const normalizedPrId = parsePositiveIntegerId(prId);
    const localBranch = `pr-${normalizedPrId}`;
    await runner("git", [
        "fetch",
        "origin",
        `pull/${normalizedPrId}/head:${localBranch}`,
    ]);
    await runner("git", ["checkout", localBranch]);
}

export async function printCheckoutPR(prId: number | string): Promise<void> {
    await checkoutPullRequest(prId);
    console.log("Checked out the PR successfully");
}
