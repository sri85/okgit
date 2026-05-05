import { expect } from "chai";
import { describe, it } from "mocha";
import { AxiosResponse } from "axios";
import { GithubRepo } from "../../lib/api/services/github/repos/GithubRepo";
import { HttpClient, RequestBody, RequestHeaders } from "../../lib/api/httpClient";
import { GithubRepoCreateData } from "../../lib/types";

class FakeRepositoryHttpClient implements HttpClient {
    calls: Array<{ method: string; url: string; data?: RequestBody }> = [];

    async get<T>(url: string): Promise<T> {
        this.calls.push({ method: "get", url });
        return this.repositoryResponse("octo/test") as T;
    }

    async post<T>(url: string, data?: RequestBody): Promise<T> {
        this.calls.push({ method: "post", url, data });
        return this.repositoryResponse("octo/new-repo") as T;
    }

    async patch<T>(url: string, data?: RequestBody): Promise<T> {
        this.calls.push({ method: "patch", url, data });
        return {} as T;
    }

    async put<T>(
        url: string,
        data?: RequestBody,
        headers?: RequestHeaders
    ): Promise<AxiosResponse<T>> {
        this.calls.push({ method: "put", url, data: { data, headers } });
        return { status: 204, data: {} as T } as AxiosResponse<T>;
    }

    async delete<T>(url: string, data?: RequestBody): Promise<T> {
        this.calls.push({ method: "delete", url, data });
        return {} as T;
    }

    private repositoryResponse(fullName: string) {
        return {
            full_name: fullName,
            html_url: `https://github.com/${fullName}`,
            ssh_url: `git@github.com:${fullName}.git`,
            forks: 2,
            open_issues: 3,
            stargazers_count: 5,
            subscribers_count: 8,
        };
    }
}

describe("GithubRepo with injected HTTP client", () => {
    const repoData: GithubRepoCreateData = {
        name: "new-repo",
        description: "Test Description",
        private: "true",
        has_issues: "true",
        has_projects: "true",
        has_wiki: "true",
        auto_init: "true",
    };

    it("maps repository details from the injected client", async () => {
        const client = new FakeRepositoryHttpClient();
        const repositories = GithubRepo.fromHttpClient("octo", client);

        const result = await repositories.getRepositoryDetails("test");

        expect(result).to.deep.equal({
            fullName: "octo/test",
            url: "https://github.com/octo/test",
            sshUrl: "git@github.com:octo/test.git",
            forks: 2,
            openIssues: 3,
            stars: 5,
            subscribers: 8,
        });
        expect(client.calls).to.deep.equal([
            { method: "get", url: "/test" },
        ]);
    });

    it("delegates repository creation through the injected client", async () => {
        const client = new FakeRepositoryHttpClient();
        const repositories = GithubRepo.fromHttpClient("octo", client);

        const result = await repositories.createRepository(repoData);

        expect(result?.fullName).to.equal("octo/new-repo");
        expect(client.calls).to.deep.equal([
            {
                method: "post",
                url: "https://api.github.com/user/repos",
                data: repoData,
            },
        ]);
    });

    it("delegates repo updates through the injected client", async () => {
        const client = new FakeRepositoryHttpClient();
        const repositories = GithubRepo.fromHttpClient("octo", client);

        const starStatus = await repositories.toggleStarUnstarRepo(
            "test",
            "star"
        );
        const vulnerabilityResponse = await repositories.enableVulnerabilityScan(
            "enable",
            "test"
        );

        expect(starStatus).to.equal(204);
        expect(vulnerabilityResponse?.status).to.equal(204);
        expect(client.calls).to.deep.equal([
            {
                method: "put",
                url: "https://api.github.com/user/starred/octo/test",
                data: { data: undefined, headers: undefined },
            },
            {
                method: "put",
                url: "/test/vulnerability-alerts",
                data: {
                    data: undefined,
                    headers: {
                        Accept: "application/vnd.github.dorian-preview+json",
                    },
                },
            },
        ]);
    });
});
