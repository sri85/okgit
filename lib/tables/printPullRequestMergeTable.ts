import { GithubPR } from "../api/services/github/GitHubAPI";
export async function printPullRequestMergeTable(
    prId: number | string
): Promise<void> {
    await GithubPR.mergePullRequest(prId);
}
