import { expect } from "chai";
import { describe, it } from "mocha";
import { AxiosResponse } from "axios";
import { GithubIssue } from "../../lib/api/services/github/issues/GithubIssue";
import { HttpClient, RequestBody, RequestHeaders } from "../../lib/api/httpClient";

class FakeHttpClient implements HttpClient {
    calls: Array<{ method: string; url: string; data?: RequestBody }> = [];

    async get<T>(url: string): Promise<T> {
        this.calls.push({ method: "get", url });
        return {
            html_url: "https://github.com/octo/test/issues/17",
            user: { login: "octo" },
            state: "open",
            assignees: [],
        } as T;
    }

    async post<T>(url: string, data?: RequestBody): Promise<T> {
        this.calls.push({ method: "post", url, data });
        return {
            html_url: "https://github.com/octo/test/issues/18",
            user: { login: "octo" },
            state: "open",
        } as T;
    }

    async patch<T>(url: string, data?: RequestBody): Promise<T> {
        this.calls.push({ method: "patch", url, data });
        return {
            html_url: "https://github.com/octo/test/issues/17",
            user: { login: "octo" },
            state: "closed",
        } as T;
    }

    async put<T>(
        url: string,
        data?: RequestBody,
        headers?: RequestHeaders
    ): Promise<AxiosResponse<T>> {
        this.calls.push({ method: "put", url, data: { data, headers } });
        return { status: 200, data: {} as T } as AxiosResponse<T>;
    }

    async delete<T>(url: string, data?: RequestBody): Promise<T> {
        this.calls.push({ method: "delete", url, data });
        return {} as T;
    }
}

describe("GithubIssue with injected HTTP client", () => {
    it("delegates create issue through the injected client", async () => {
        const client = new FakeHttpClient();
        const issues = GithubIssue.fromHttpClient("test", client);

        const result = await issues.createIssue("title", "body");

        expect(result).to.equal("https://github.com/octo/test/issues/18");
        expect(client.calls).to.deep.equal([
            {
                method: "post",
                url: "test/issues",
                data: { title: "title", body: "body" },
            },
        ]);
    });

    it("delegates issue lookup through the injected client", async () => {
        const client = new FakeHttpClient();
        const issues = GithubIssue.fromHttpClient("test", client);

        const result = await issues.getIssueDetails(17);

        expect(result).to.deep.equal({
            url: "https://github.com/octo/test/issues/17",
            author: "octo",
            state: "open",
        });
        expect(client.calls).to.deep.equal([
            { method: "get", url: "/test/issues/17" },
        ]);
    });

    it("delegates issue updates through the injected client", async () => {
        const client = new FakeHttpClient();
        const issues = GithubIssue.fromHttpClient("test", client);

        const result = await issues.updateIssue("close", 17, "closed");

        expect(result).to.equal("https://github.com/octo/test/issues/17");
        expect(client.calls).to.deep.equal([
            {
                method: "patch",
                url: "test/issues/17",
                data: { state: "closed" },
            },
        ]);
    });
});
