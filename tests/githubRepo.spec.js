import { describe, it, afterEach } from "mocha";
import nock from "nock";
import { expect } from "chai";
import { GithubRepo } from "../lib/api/services/github/repos/GithubRepo";
import createAPIBaseURL from "../lib/utils/helpers";
import { org, token } from "../lib/configManager/parseConfig";

describe("Github Repo API", async () => {
    const API_BASE_URL = "https://api.github.com";
    const githubRepoObject = new GithubRepo(createAPIBaseURL(org));
    const repoData = {
        name: "test-repo",
        description: "Test Description",
        private: "true",
        has_issues: "true",
        has_projects: "true",
        has_wiki: "true",
        auto_init: "true",
    };
    const mockResponse = {
        full_name: "test-repo",
        html_url: "https://github.com/octo/test-repo",
        ssh_url: "git@github.com:octo/test-repo.git",
        forks: 23,
        open_issues: 0,
        stargazers_count: 45,
        subscribers_count: 56,
    };
    afterEach(() => {
        nock.cleanAll();
    });
    const expectedResponse = [
        [
            "test-repo",
            "https://github.com/octo/test-repo",
            "git@github.com:octo/test-repo.git",
            23,
            0,
            45,
            56,
        ],
    ];
    describe("Create Repo", async () => {
        it("should be able to create repo", async () => {
            nock(API_BASE_URL, {
                reqheaders: {
                    authorization: `token ${token}`,
                },
            })
                .post("/user/repos", repoData)
                .reply(201, mockResponse);

            expect(await githubRepoObject.createRepo(repoData)).to.deep.equal(
                expectedResponse
            );
        });
        it("should return empty list when the API returns a 500", async () => {
            nock(API_BASE_URL, {
                reqheaders: {
                    authorization: `token ${token}`,
                },
            })
                .post("/user/repos", repoData)
                .reply(500);
            expect(await githubRepoObject.createRepo(repoData)).to.deep.equal(
                []
            );
        });
    });
    describe("List Repository Details", async () => {
        it("should get repo details", async () => {
            nock(API_BASE_URL, {
                reqheaders: {
                    authorization: `token ${token}`,
                },
            })
                .get("/repos/getndazn/dapact")
                .reply(200, mockResponse);
            expect(
                await githubRepoObject.getRepoDetails("dapact")
            ).to.deep.equal(expectedResponse);
        });
        it("should get empty array when the API returns 500", async () => {
            nock(API_BASE_URL, {
                reqheaders: {
                    authorization: `token ${token}`,
                },
            })
                .get("/repos/getndazn/dapact")
                .reply(500);
            expect(
                await githubRepoObject.getRepoDetails("dapact")
            ).to.deep.equal([]);
        });
        it("should get empty array when the API returns 500", async () => {
            nock(API_BASE_URL, {
                reqheaders: {
                    authorization: `token ${token}`,
                },
            })
                .get("/repos/getndazn/dapact")
                .reply(404);
            expect(
                await githubRepoObject.getRepoDetails("dapact")
            ).to.deep.equal([]);
        });
    });

    describe("Star/ Unstar Repo", async () => {
        it("should be able to star a repo", async () => {
            nock(API_BASE_URL, {
                reqheaders: {
                    authorization: `token ${token}`,
                },
            })
                .put("/user/starred/getndazn/dapact")
                .reply(204);
            expect(
                await githubRepoObject.toggleStarUnstarRepo("dapact", "star")
            ).to.equal(204);
        });
        it("should be able to unstar a repo", async () => {
            nock(API_BASE_URL, {
                reqheaders: {
                    authorization: `token ${token}`,
                },
            })
                .delete("/user/starred/getndazn/dapact")
                .reply(204);
            expect(
                await githubRepoObject.toggleStarUnstarRepo("dapact", "unstar")
            ).to.equal(undefined);
        });
    });
});
