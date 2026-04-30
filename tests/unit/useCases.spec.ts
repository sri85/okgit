import { describe, it, afterEach } from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import { createIssueUseCases } from "../../lib/application/usecases/issues";
import { createPullRequestUseCases } from "../../lib/application/usecases/pullRequests";
import { createRepositoryUseCases } from "../../lib/application/usecases/repositories";
import { OkgitProvider } from "../../lib/providers/contracts";
import { GithubRepoCreateData } from "../../lib/types";

interface ProviderCalls {
    method: string;
    args: unknown[];
}

function createFakeProvider(calls: ProviderCalls[]): OkgitProvider {
    return {
        pullRequests: {
            async createPullRequest(
                title: string,
                currentBranchName: string,
                baseBranchName: string,
                body: string
            ) {
                calls.push({
                    method: "pullRequests.createPullRequest",
                    args: [title, currentBranchName, baseBranchName, body],
                });
                return "https://github.com/octo/test/pull/1";
            },
            async listPullRequests(repoName: string, state: string | undefined) {
                calls.push({
                    method: "pullRequests.listPullRequests",
                    args: [repoName, state],
                });
                return [
                    {
                        url: "https://github.com/octo/test/pull/1",
                        state: "open",
                        author: "octo",
                        createdAt: "1 day ago",
                    },
                ];
            },
            async getPullRequestSummary(id: number | string) {
                calls.push({
                    method: "pullRequests.getPullRequestSummary",
                    args: [id],
                });
                return {
                    merged: false,
                    additions: 1,
                    deletions: 0,
                    changedFiles: 1,
                    mergeableState: "clean",
                    commits: 1,
                    comments: 0,
                    reviewComments: 0,
                };
            },
            async listPullRequestComments(id: number | string) {
                calls.push({
                    method: "pullRequests.listPullRequestComments",
                    args: [id],
                });
                return [];
            },
            async listPullRequestCommits(id: number | string) {
                calls.push({
                    method: "pullRequests.listPullRequestCommits",
                    args: [id],
                });
                return [];
            },
            async listPullRequestFiles(id: number | string) {
                calls.push({
                    method: "pullRequests.listPullRequestFiles",
                    args: [id],
                });
                return [];
            },
            async updatePullRequestStatus(id: number | string, state: string) {
                calls.push({
                    method: "pullRequests.updatePullRequestStatus",
                    args: [id, state],
                });
                return state;
            },
            async addReviewers(id: number | string, reviewerNames: string[]) {
                calls.push({
                    method: "pullRequests.addReviewers",
                    args: [id, reviewerNames],
                });
                return reviewerNames;
            },
            async removeReviewers(
                id: number | string,
                reviewerNames: string[]
            ) {
                calls.push({
                    method: "pullRequests.removeReviewers",
                    args: [id, reviewerNames],
                });
                return reviewerNames;
            },
            async mergePullRequest(id: number | string) {
                calls.push({
                    method: "pullRequests.mergePullRequest",
                    args: [id],
                });
                return {
                    status: 200,
                    message: "Pull Request successfully merged",
                };
            },
        },
        issues: {
            async createIssue(issueTitle: string, issueBody: string) {
                calls.push({
                    method: "issues.createIssue",
                    args: [issueTitle, issueBody],
                });
                return "https://github.com/octo/test/issues/1";
            },
            async getIssueDetails(issueId: number | string) {
                calls.push({
                    method: "issues.getIssueDetails",
                    args: [issueId],
                });
                return {
                    url: "https://github.com/octo/test/issues/1",
                    author: "octo",
                    state: "open",
                };
            },
            async listIssues() {
                calls.push({ method: "issues.listIssues", args: [] });
                return [];
            },
            async updateIssue(
                action: "close" | "assign" | "label",
                issueNumber: number | string,
                data: string | string[]
            ) {
                calls.push({
                    method: "issues.updateIssue",
                    args: [action, issueNumber, data],
                });
                return "https://github.com/octo/test/issues/1";
            },
        },
        repositories: {
            async getRepositoryDetails(repoName: string) {
                calls.push({
                    method: "repositories.getRepositoryDetails",
                    args: [repoName],
                });
                return {
                    fullName: "octo/test",
                    url: "https://github.com/octo/test",
                    sshUrl: "git@github.com:octo/test.git",
                    forks: 1,
                    openIssues: 0,
                    stars: 2,
                    subscribers: 3,
                };
            },
            async createRepository(repoData: GithubRepoCreateData) {
                calls.push({
                    method: "repositories.createRepository",
                    args: [repoData],
                });
                return {
                    fullName: repoData.name,
                    url: "https://github.com/octo/test",
                    sshUrl: "git@github.com:octo/test.git",
                    forks: 0,
                    openIssues: 0,
                    stars: 0,
                    subscribers: 0,
                };
            },
            async toggleStarUnstarRepo(
                repoName: string,
                action: "star" | "unstar"
            ) {
                calls.push({
                    method: "repositories.toggleStarUnstarRepo",
                    args: [repoName, action],
                });
                return 204;
            },
            async enableVulnerabilityScan(
                action: "enable",
                repoName: string
            ) {
                calls.push({
                    method: "repositories.enableVulnerabilityScan",
                    args: [action, repoName],
                });
                return undefined;
            },
        },
    };
}

describe("use cases", () => {
    afterEach(() => {
        sinon.restore();
    });

    it("delegates issue actions to the configured issue provider", async () => {
        const calls: ProviderCalls[] = [];
        const useCases = createIssueUseCases(createFakeProvider(calls));

        expect(await useCases.getIssue(1)).to.deep.equal({
            url: "https://github.com/octo/test/issues/1",
            author: "octo",
            state: "open",
        });
        expect(
            await useCases.updateIssue("assign", 1, ["octo"])
        ).to.equal("https://github.com/octo/test/issues/1");

        expect(calls).to.deep.equal([
            { method: "issues.getIssueDetails", args: [1] },
            { method: "issues.updateIssue", args: ["assign", 1, ["octo"]] },
        ]);
    });

    it("delegates pull request creation and prints the created URL", async () => {
        const calls: ProviderCalls[] = [];
        const useCases = createPullRequestUseCases(createFakeProvider(calls));
        const log = sinon.stub(console, "log");

        expect(
            await useCases.createPullRequest(
                "Add provider tests",
                "feature/tests",
                "main",
                "body"
            )
        ).to.equal("https://github.com/octo/test/pull/1");

        expect(calls).to.deep.equal([
            {
                method: "pullRequests.createPullRequest",
                args: ["Add provider tests", "feature/tests", "main", "body"],
            },
        ]);
        expect(log.calledOnce).to.equal(true);
        expect(String(log.firstCall.args[0])).to.contain(
            "https://github.com/octo/test/pull/1"
        );
    });

    it("delegates repository updates and prints the update result", async () => {
        const calls: ProviderCalls[] = [];
        const useCases = createRepositoryUseCases(createFakeProvider(calls));
        const log = sinon.stub(console, "log");

        await useCases.updateRepository("star", "test");

        expect(calls).to.deep.equal([
            {
                method: "repositories.toggleStarUnstarRepo",
                args: ["test", "star"],
            },
        ]);
        expect(log.calledOnceWithExactly("Starred test successfully")).to.equal(
            true
        );
    });
});
