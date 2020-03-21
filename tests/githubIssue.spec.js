import { describe, it, afterEach } from "mocha";
import nock from "nock";
import { expect } from "chai";
import { GithubIssue } from "../lib/api/services/github/issues/GithubIssue";
import createAPIBaseURL from "../lib/utils/helpers";
import { org, token } from "../lib/configManager/parseConfig";

describe("Github Issue", async () => {
    const API_BASE_URL = "https://api.github.com";
    const githubIssueObject = new GithubIssue(createAPIBaseURL(org));
    afterEach(() => {
        nock.cleanAll();
    });
    describe("Create Issue", async () => {
        const createIssueURL = "/repos/getndazn/dapact/issues";
        const data = {
            title: "this is a test title",
            body: "this is a test body",
        };
        it("should be able to create an issue", async () => {
            const mockResponse =
                "https://github.com/sripathipai/git-cli/issues/17";
            nock(API_BASE_URL, {
                reqheaders: {
                    authorization: `token ${token}`,
                },
            })
                .post(createIssueURL, data)
                .reply(200, { html_url: mockResponse });
            expect(
                await githubIssueObject.createIssue(data.title, data.body)
            ).to.equal(mockResponse);
        });
        it("should return empty when the create issue endpoint returns a 500", async () => {
            nock(API_BASE_URL, {
                reqheaders: {
                    authorization: `token ${token}`,
                },
            })
                .post(createIssueURL, data)
                .reply(500);
            expect(
                await githubIssueObject.createIssue(data.title, data.body)
            ).to.equal("");
        });
        it("should return empty when the create issue endpoint returns a 404", async () => {
            nock(API_BASE_URL, {
                reqheaders: {
                    authorization: `token ${token}`,
                },
            })
                .post(createIssueURL, data)
                .reply(404);
            expect(
                await githubIssueObject.createIssue(data.title, data.body)
            ).to.equal("");
        });
    });
    describe("Get Issue", async () => {
        const getIssueUrl = "/repos/getndazn/dapact/issues/17";
        it("should return issue url ,username and state when API returns a valid response", async () => {
            nock(API_BASE_URL, {
                reqheaders: {
                    authorization: `token ${token}`,
                },
            })
                .get(getIssueUrl)
                .reply(200, {
                    html_url: "https://github.com/octo/cli/issues/17",
                    user: {
                        login: "octo",
                    },
                    state: "open",
                    assignees: [],
                });
            expect(await githubIssueObject.getIssue(17)).to.deep.equal([
                ["https://github.com/octo/cli/issues/17", "octo", "open"],
            ]);
        });
        it("should return empty string when the API returns a 500", async () => {
            nock(API_BASE_URL, {
                reqheaders: {
                    authorization: `token ${token}`,
                },
            })
                .get(getIssueUrl)
                .reply(500);
            expect(await githubIssueObject.getIssue(17)).to.deep.equal([]);
        });
        it("should return empty string when the API returns a 404", async () => {
            nock(API_BASE_URL, {
                reqheaders: {
                    authorization: `token ${token}`,
                },
            })
                .get(getIssueUrl)
                .reply(404);
            expect(await githubIssueObject.getIssue(17)).to.deep.equal([]);
        });
    });
    describe("Get Issues", async () => {
        const getIssuesUrl = "/repos/getndazn/dapact/issues";
        it("should return issue url ,username and state when API returns a valid response", async () => {
            nock(API_BASE_URL, {
                reqheaders: {
                    authorization: `token ${token}`,
                },
            })
                .get(getIssuesUrl)
                .reply(200, [
                    {
                        html_url: "https://github.com/octo/cli/issues/17",
                        user: {
                            login: "octo",
                        },
                        state: "open",
                        assignees: [],
                    },
                ]);
            expect(await githubIssueObject.getIssues()).to.deep.equal([
                ["https://github.com/octo/cli/issues/17", "octo", "open"],
            ]);
        });
        it("should return an empty array when the API returns a 500", async () => {
            nock(API_BASE_URL, {
                reqheaders: {
                    authorization: `token ${token}`,
                },
            })
                .get(getIssuesUrl)
                .reply(500);
            expect(await githubIssueObject.getIssues()).to.deep.equal([]);
        });
        it("should return an empty array when teh API returns a 404", async () => {
            nock(API_BASE_URL, {
                reqheaders: {
                    authorization: `token ${token}`,
                },
            })
                .get(getIssuesUrl)
                .reply(404);
            expect(await githubIssueObject.getIssues()).to.deep.equal([]);
        });
    });
    describe("updateIssue", async () => {
        const updateIssueUrl = "/repos/getndazn/dapact/issues/17";
        it("should be able to assign an issue", async () => {
            nock(API_BASE_URL, {
                reqheaders: {
                    authorization: `token ${token}`,
                },
            })
                .patch(updateIssueUrl, { assignees: ["octo"] })
                .reply(200, { html_url: "https://google.com" });
            expect(
                await githubIssueObject.updateIssue("assign", 17, ["octo"])
            ).to.equal("https://google.com");
        });
        it("should be able to close the issue", async () => {
            nock(API_BASE_URL, {
                reqheaders: {
                    authorization: `token ${token}`,
                },
            })
                .patch(updateIssueUrl, { state: "closed" })
                .reply(200, { html_url: "https://google.com" });
            expect(
                await githubIssueObject.updateIssue("close", 17, "closed")
            ).to.equal("https://google.com");
        });
        it("should be able to update label of an issue", async () => {
            nock(API_BASE_URL, {
                reqheaders: {
                    authorization: `token ${token}`,
                },
            })
                .patch(updateIssueUrl, { labels: ["documentation"] })
                .reply(200, { html_url: "https://google.com" });
            expect(
                await githubIssueObject.updateIssue("label", 17, [
                    "documentation",
                ])
            ).to.equal("https://google.com");
        });
        it("should return an empty string when the API returns a 500", async () => {
            nock(API_BASE_URL, {
                reqheaders: {
                    authorization: `token ${token}`,
                },
            })
                .patch(updateIssueUrl, { labels: ["documentation"] })
                .reply(500);
            expect(
                await githubIssueObject.updateIssue("label", 17, [
                    "documentation",
                ])
            ).to.equal("");
        });
    });
});
