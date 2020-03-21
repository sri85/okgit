
import { GithubPR } from "../api/services/github/GitHubAPI";
export async function printPullRequestMergeTable(prId) {
    await GithubPR.mergePullRequest(prId);
}
