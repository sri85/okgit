import { okgitProvider } from "../../providers";
import {
    OkgitProvider,
    PullRequestComment,
    PullRequestCommit,
    PullRequestFile,
    PullRequestListItem,
    PullRequestSummary,
} from "../../providers/contracts";
import clc from "cli-color";

export function createPullRequestUseCases(provider: OkgitProvider) {
    return {
        async createPullRequest(
            title: string,
            currentBranchName: string,
            baseBranchName: string,
            body: string
        ): Promise<string> {
            const pullRequestUrl = await provider.pullRequests.createPullRequest(
                title,
                currentBranchName,
                baseBranchName,
                body
            );
            if (pullRequestUrl !== "") {
                console.log(
                    `Created Pull Request ${pullRequestUrl} 🚀 ${clc.green(
                        "use okgit pr <id> --web "
                    )} top open in your favorite browser`
                );
            }
            return pullRequestUrl;
        },

        listPullRequests(
            repoName: string,
            state: string | undefined
        ): Promise<PullRequestListItem[]> {
            return provider.pullRequests.listPullRequests(repoName, state);
        },

        listPullRequestComments(
            id: number | string
        ): Promise<PullRequestComment[]> {
            return provider.pullRequests.listPullRequestComments(id);
        },

        listPullRequestCommits(
            id: number | string
        ): Promise<PullRequestCommit[]> {
            return provider.pullRequests.listPullRequestCommits(id);
        },

        listPullRequestFiles(
            id: number | string
        ): Promise<PullRequestFile[]> {
            return provider.pullRequests.listPullRequestFiles(id);
        },

        getPullRequestSummary(
            id: number | string
        ): Promise<PullRequestSummary | undefined> {
            return provider.pullRequests.getPullRequestSummary(id);
        },

        updatePullRequestStatus(
            id: number | string,
            state: string
        ): Promise<string> {
            return provider.pullRequests.updatePullRequestStatus(id, state);
        },

        addPullRequestReviewers(
            id: number | string,
            reviewerNames: string[]
        ): Promise<string[]> {
            return provider.pullRequests.addReviewers(id, reviewerNames);
        },

        removePullRequestReviewers(
            id: number | string,
            reviewerNames: string[]
        ): Promise<string[]> {
            return provider.pullRequests.removeReviewers(id, reviewerNames);
        },

        async mergePullRequest(id: number | string): Promise<void> {
            const result = await provider.pullRequests.mergePullRequest(id);
            if (result === undefined) {
                return;
            }
            if (result.status === 200) {
                console.log(`Merged ${id} ${result.message} successfully 💥`);
            } else if (result.status === 405 || result.status === 409) {
                console.error(
                    `Failed to merge because ${result.message} 😞 please open the PR okgit pr <id> --web`
                );
            }
        },
    };
}

const pullRequestUseCases = createPullRequestUseCases(okgitProvider);

export const createPullRequest = pullRequestUseCases.createPullRequest;
export const listPullRequests = pullRequestUseCases.listPullRequests;
export const listPullRequestComments =
    pullRequestUseCases.listPullRequestComments;
export const listPullRequestCommits =
    pullRequestUseCases.listPullRequestCommits;
export const listPullRequestFiles = pullRequestUseCases.listPullRequestFiles;
export const getPullRequestSummary = pullRequestUseCases.getPullRequestSummary;
export const updatePullRequestStatus =
    pullRequestUseCases.updatePullRequestStatus;
export const addPullRequestReviewers =
    pullRequestUseCases.addPullRequestReviewers;
export const removePullRequestReviewers =
    pullRequestUseCases.removePullRequestReviewers;
export const mergePullRequest = pullRequestUseCases.mergePullRequest;
