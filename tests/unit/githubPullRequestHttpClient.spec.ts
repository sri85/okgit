import { expect } from "chai";
import { describe, it } from "mocha";
import { AxiosResponse } from "axios";
import { GithubPullRequest } from "../../lib/api/services/github/pull_requests/GithubPullRequest";
import { HttpClient, RequestBody, RequestHeaders } from "../../lib/api/httpClient";

class FakePullRequestHttpClient implements HttpClient {
    calls: Array<{ method: string; url: string; data?: RequestBody }> = [];

    async get<T>(url: string): Promise<T> {
        this.calls.push({ method: "get", url });
        return {
            merged: false,
            additions: 12,
            deletions: 3,
            changed_files: 2,
            mergeable_state: "clean",
            commits: 4,
            comments: 1,
            review_comments: 5,
        } as T;
    }

    async post<T>(url: string, data?: RequestBody): Promise<T> {
        this.calls.push({ method: "post", url, data });
        if (url.endsWith("requested_reviewers")) {
            return {
                requested_reviewers: [{ login: "octo" }, { login: "hubot" }],
            } as T;
        }
        return {
            html_url: "https://github.com/octo/test/pull/12",
        } as T;
    }

    async patch<T>(url: string, data?: RequestBody): Promise<T> {
        this.calls.push({ method: "patch", url, data });
        return { state: "closed" } as T;
    }

    async put<T>(
        url: string,
        data?: RequestBody,
        headers?: RequestHeaders
    ): Promise<AxiosResponse<T>> {
        this.calls.push({ method: "put", url, data: { data, headers } });
        return {
            status: 200,
            data: { message: "Pull Request successfully merged" } as T,
        } as AxiosResponse<T>;
    }

    async delete<T>(url: string, data?: RequestBody): Promise<T> {
        this.calls.push({ method: "delete", url, data });
        return {
            requested_reviewers: [{ login: "hubot" }],
        } as T;
    }
}

describe("GithubPullRequest with injected HTTP client", () => {
    it("delegates pull request creation through the injected client", async () => {
        const client = new FakePullRequestHttpClient();
        const pullRequests = GithubPullRequest.fromHttpClient("test", client);

        const result = await pullRequests.createPullRequest(
            "title",
            "feature",
            "main",
            "body"
        );

        expect(result).to.equal("https://github.com/octo/test/pull/12");
        expect(client.calls).to.deep.equal([
            {
                method: "post",
                url: "/test/pulls",
                data: {
                    title: "title",
                    head: "feature",
                    base: "main",
                    body: "body",
                },
            },
        ]);
    });

    it("maps pull request summaries from the injected client", async () => {
        const client = new FakePullRequestHttpClient();
        const pullRequests = GithubPullRequest.fromHttpClient("test", client);

        const result = await pullRequests.getPullRequestSummary(12);

        expect(result).to.deep.equal({
            merged: false,
            additions: 12,
            deletions: 3,
            changedFiles: 2,
            mergeableState: "clean",
            commits: 4,
            comments: 1,
            reviewComments: 5,
        });
        expect(client.calls).to.deep.equal([
            { method: "get", url: "/test/pulls/12" },
        ]);
    });

    it("delegates reviewer updates and merge requests", async () => {
        const client = new FakePullRequestHttpClient();
        const pullRequests = GithubPullRequest.fromHttpClient("test", client);

        const added = await pullRequests.addReviewers(12, ["octo", "hubot"]);
        const removed = await pullRequests.removeReviewers(12, ["octo"]);
        const merge = await pullRequests.mergePullRequest(12);

        expect(added).to.deep.equal(["octo", "hubot"]);
        expect(removed).to.deep.equal(["hubot"]);
        expect(merge).to.deep.equal({
            status: 200,
            message: "Pull Request successfully merged",
        });
        expect(client.calls).to.deep.equal([
            {
                method: "post",
                url: "/test/pulls/12/requested_reviewers",
                data: { reviewers: ["octo", "hubot"] },
            },
            {
                method: "delete",
                url: "/test/pulls/12/requested_reviewers",
                data: { reviewers: ["octo"] },
            },
            {
                method: "put",
                url: "/test/pulls/12/merge",
                data: { data: 12, headers: undefined },
            },
        ]);
    });
});
