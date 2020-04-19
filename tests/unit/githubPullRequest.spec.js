import { describe, it, afterEach, xit } from "mocha";
import nock from "nock";
import { expect } from "chai";

import {
    listPullRequestsMocks,
    listPullRequestEmptyResponse,
    listPullRequestMissingHTMLResponse,
    listPullRequestMissingUserResponse,
} from "./mocks/pull_requests/listPullRequestsMocks.js";
import { pullRequestDetailsMock } from "./mocks/pull_requests/pullRequestDetailsMocks.js";
import { pullrequestFilesMocks } from "./mocks/pull_requests/pullRequestFilesMocks.js";
import { pullRequestCommitsMocks } from "./mocks/pull_requests/pullRequestCommitsMocks.js";
import { pullRequestAddReviewersMocks } from "./mocks/pull_requests/pullRequestAddReviewersMocks";
import {
    updatePullRequestClosedMocks,
    updatePullRequestOpenMocks,
} from "./mocks/pull_requests/updatedPullRequestMocks";
import { GithubPullRequest } from "../../lib/api/services/github/pull_requests/GithubPullRequest.js";
import { org, token } from "../../lib/configManager/parseConfig.js";
import createAPIBaseURL from "../../lib/utils/helpers";
import { listPullRequestMissingCreatedAtResponse } from "./mocks/pull_requests/listPullRequestsMocks";

describe("GitHubPullRequests", () => {
    const API_BASE_URL = "https://api.github.com";
    const pullRequestObject = new GithubPullRequest(
        createAPIBaseURL(org, "github")
    );

    afterEach(() => {
        nock.cleanAll();
    });

    describe("getPullRequests", () => {
        const pullRequestURL =
            "/repos/octo/playback-web-player/pulls?state=open";
        xit("should return pr link ,state ,username and the date when PR was raised when the API returns 200 ", async () => {
            nock(API_BASE_URL, {
                authorization: `token ${token}`,
            })
                .get(pullRequestURL)
                .reply(200, listPullRequestsMocks);
            const expectedResult = [
                [
                    "https://github.com/octo/test/pull/43",
                    "open",
                    "sri85",
                    "12 days ago",
                ],
                [
                    "https://github.com/octo/test/pull/23",
                    "open",
                    "sri85",
                    "5 months ago",
                ],
            ];
            expect(
                await pullRequestObject.getPullRequests(
                    "playback-web-player",
                    "open"
                )
            ).to.deep.equal(expectedResult);
        });

        it("should return an empty array when the github api returns an empty response", async () => {
            nock(API_BASE_URL, {
                authorization: `token ${token}`,
            })
                .get(pullRequestURL)
                .reply(200, listPullRequestEmptyResponse);

            expect(
                await pullRequestObject.getPullRequests(
                    "playback-web-player",
                    "open"
                )
            ).to.deep.equal([]);
        });
        it("should return an empty array when the github api returns response when required html key is missing", async () => {
            nock(API_BASE_URL, {
                authorization: `token ${token}`,
            })
                .get(pullRequestURL)
                .reply(200, listPullRequestMissingHTMLResponse);

            expect(
                await pullRequestObject.getPullRequests(
                    "playback-web-player",
                    "open"
                )
            ).to.deep.equal([]);
        });
        it("should return an empty array when the github api returns response when required created at key is missing", async () => {
            nock(API_BASE_URL, {
                authorization: `token ${token}`,
            })
                .get(pullRequestURL)
                .reply(200, listPullRequestMissingCreatedAtResponse);

            expect(
                await pullRequestObject.getPullRequests(
                    "playback-web-player",
                    "open"
                )
            ).to.deep.equal([]);
        });
        it("should return an empty array when the github api returns response when required user key is missing", async () => {
            nock(API_BASE_URL, {
                authorization: `token ${token}`,
            })
                .get("/repos/octo/playback-web-player/pulls?state=open")
                .reply(200, listPullRequestMissingUserResponse);

            expect(
                await pullRequestObject.getPullRequests(
                    "playback-web-player",
                    "open"
                )
            ).to.deep.equal([]);
        });
        it("should return an empty array when the github api returns 500", async () => {
            nock(API_BASE_URL, {
                authorization: `token ${token}`,
            })
                .get(pullRequestURL)
                .reply(500, [{}]);

            expect(
                await pullRequestObject.getPullRequests(
                    "playback-web-player",
                    "open"
                )
            ).to.deep.equal([]);
        });
        it("should return an empty array when the github api returns 400", async () => {
            nock(API_BASE_URL, {
                authorization: `token ${token}`,
            })
                .get(pullRequestURL)
                .reply(400, [{}]);

            expect(
                await pullRequestObject.getPullRequests(
                    "playback-web-player",
                    "open"
                )
            ).to.deep.equal([]);
        });
    });
    describe("getPullRequest", async () => {
        const pullRequestIdUrl = "/repos/octo/test/pulls/12";
        it("should return an empty array when the response is empty ", async () => {
            nock(API_BASE_URL, {
                authorization: `token ${token}`,
            })
                .get(pullRequestIdUrl)
                .reply(200, [{}]);
            expect(await pullRequestObject.getPullRequest(12)).to.deep.equal(
                []
            );
        });
        it("should return an empty array  when api returns 400", async () => {
            nock(API_BASE_URL, {
                authorization: `token ${token}`,
            })
                .get(pullRequestIdUrl)
                .reply(400, [{}]);
            expect(await pullRequestObject.getPullRequest(12)).to.deep.equal(
                []
            );
        });
        it("should return an empty array when api returns 500", async () => {
            nock(API_BASE_URL, {
                authorization: `token ${token}`,
            })
                .get(pullRequestIdUrl)
                .reply(500, [{}]);
            expect(await pullRequestObject.getPullRequest(12)).to.deep.equal(
                []
            );
        });
        it("should return an array with keys when the api returns a valid response", async () => {
            const expectedResult = [[false, 126, 284, 16, "behind", 6, 1, 3]];
            nock(API_BASE_URL, {
                authorization: `token ${token}`,
            })
                .get(pullRequestIdUrl)
                .reply(200, pullRequestDetailsMock);

            expect(await pullRequestObject.getPullRequest(12)).to.deep.equal(
                expectedResult
            );
        });
    });
    describe("getPullRequestFiles", async () => {
        const FILES_ENDPOINT_URL = "/repos/octo/test/pulls/12/files";
        it("should return an empty array if the files endpoint returns 400", async () => {
            nock(API_BASE_URL, {
                authorization: `token ${token}`,
            })
                .get(FILES_ENDPOINT_URL)
                .reply(400, [{}]);
            expect(
                await pullRequestObject.showPullRequestFiles(12)
            ).to.deep.equal([]);
        });
        it("should return an empty array if the files endpoint returns 500", async () => {
            nock(API_BASE_URL, {
                authorization: `token ${token}`,
            })
                .get(FILES_ENDPOINT_URL)
                .reply(500, [{}]);
            expect(
                await pullRequestObject.showPullRequestFiles(12)
            ).to.deep.equal([]);
        });
        it("should return an empty array if the files endpoint returns an empty response", async () => {
            nock(API_BASE_URL, {
                authorization: `token ${token}`,
            })
                .get(FILES_ENDPOINT_URL)
                .reply(200, [{}]);
            expect(
                await pullRequestObject.showPullRequestFiles(12)
            ).to.deep.equal([]);
        });
        it("should return an empty array if the files endpoint returns an empty response", async () => {
            const expectedResult = [
                [
                    "README.md",
                    "modified",
                    "\u001b[32m1\u001b[39m",
                    "\u001b[31m0\u001b[39m",
                    "modified",
                    "1",
                ],
            ];
            nock(API_BASE_URL, {
                authorization: `token ${token}`,
            })
                .get("/repos/octo/test/pulls/12/files")
                .reply(200, pullrequestFilesMocks);
            expect(
                await pullRequestObject.showPullRequestFiles(12)
            ).to.deep.equal(expectedResult);
        });
    });
    describe("showPullRequestCommits", async () => {
        const COMMITS_ENDPOINT_URL = "/repos/octo/test/pulls/12/commits";
        it("should return empty if the commits endpoint returns an empty response ", async () => {
            nock(API_BASE_URL, {
                authorization: `token ${token}`,
            })
                .get(COMMITS_ENDPOINT_URL)
                .reply(200, [{}]);
            expect(
                await pullRequestObject.showPullRequestCommits(12)
            ).to.deep.equal([]);
        });
        it("should return empty if the commits endpoint returns a 400 response ", async () => {
            nock(API_BASE_URL, {
                authorization: `token ${token}`,
            })
                .get(COMMITS_ENDPOINT_URL)
                .reply(400);
            expect(
                await pullRequestObject.showPullRequestCommits(12)
            ).to.deep.equal([]);
        });
        it("should return empty if the commits endpoint returns a 500 response ", async () => {
            nock(API_BASE_URL, {
                authorization: `token ${token}`,
            })
                .get(COMMITS_ENDPOINT_URL)
                .reply(500);
            expect(
                await pullRequestObject.showPullRequestCommits(12)
            ).to.deep.equal([]);
        });
        it("should return an object when the commit endpoint returns a valid response ", async () => {
            nock(API_BASE_URL, {
                authorization: `token ${token}`,
            })
                .get(COMMITS_ENDPOINT_URL)
                .reply(200, pullRequestCommitsMocks);
            const expectedResult = [
                [
                    "sri85",
                    "test commit",
                    "https://github.com/octo/test/commit/168c42f4cda8933fbe5ce728c7bb34289fa08304",
                ],
            ];

            expect(
                await pullRequestObject.showPullRequestCommits(12)
            ).to.deep.equal(expectedResult);
        });
    });
    describe("updatePullRequestStatus", async () => {
        const updatePullRequestUrl = "/repos/octo/test/pulls/12";

        it("should be able to close the pull request", async () => {
            nock(API_BASE_URL, {
                reqheaders: {
                    authorization: `token ${token}`,
                },
            })
                .patch(updatePullRequestUrl, {
                    state: "closed",
                })
                .reply(200, updatePullRequestClosedMocks);

            expect(
                await pullRequestObject.updatePullRequestStatus(12, "closed")
            ).to.equal("closed");
        });
        it("should be able to re-open the pull request", async () => {
            nock(API_BASE_URL, {
                reqheaders: {
                    authorization: `token ${token}`,
                },
            })
                .patch(updatePullRequestUrl, {
                    state: "open",
                })
                .reply(200, updatePullRequestOpenMocks);
            expect(
                await pullRequestObject.updatePullRequestStatus(12, "open")
            ).to.equal("open");
        });
        it("should return an empty array when github api returns 500", async () => {
            nock(API_BASE_URL, {
                reqheaders: {
                    authorization: `token ${token}`,
                },
            })
                .patch(updatePullRequestUrl, {
                    state: "open",
                })
                .reply(500, {});
            expect(
                await pullRequestObject.updatePullRequestStatus(12, "open")
            ).to.deep.equal("");
        });
        it("should return an empty array when github api returns 422", async () => {
            nock(API_BASE_URL, {
                reqheaders: {
                    authorization: `token ${token}`,
                },
            })
                .patch(updatePullRequestUrl, {
                    state: "open",
                })
                .reply(422, {});
            expect(
                await pullRequestObject.updatePullRequestStatus(12, "open")
            ).to.deep.equal("");
        });
    });
    describe("Add reviewers", async () => {
        const addReviewersUrl = "/repos/octo/test/pulls/43/requested_reviewers";
        it("should return an empty array if it reviewers api returns 500", async () => {
            nock(API_BASE_URL, {
                reqheaders: {
                    authorization: `token ${token}`,
                },
            })
                .post(addReviewersUrl, {
                    reviewers: ["sri85"],
                })
                .reply(500, {});
            expect(
                await pullRequestObject.addReviewers(43, ["sri85"])
            ).to.deep.equal([]);
        });
        it("should return an empty array if it reviewers api returns 400", async () => {
            nock(API_BASE_URL, {
                reqheaders: {
                    authorization: `token ${token}`,
                },
            })
                .post(addReviewersUrl, {
                    reviewers: ["sri85"],
                })
                .reply(400, {});
            expect(
                await pullRequestObject.addReviewers(43, ["sri85"])
            ).to.deep.equal([]);
        });
        it("should return an empty array if it reviewers api returns an empty response", async () => {
            nock(API_BASE_URL, {
                reqheaders: {
                    authorization: `token ${token}`,
                },
            })
                .post(addReviewersUrl, {
                    reviewers: ["sri85"],
                })
                .reply(200, {});
            expect(
                await pullRequestObject.addReviewers(43, ["sri85"])
            ).to.deep.equal([]);
        });
        it("should return an empty array if it", async () => {
            nock(API_BASE_URL, {
                reqheaders: {
                    authorization: `token ${token}`,
                },
            })
                .post(addReviewersUrl, {
                    reviewers: ["sri85"],
                })
                .reply(201, pullRequestAddReviewersMocks);
            expect(
                await pullRequestObject.addReviewers(43, ["sri85"])
            ).to.deep.equal(["sri85"]);
        });
    });
    describe("Remove reviewers", async () => {
        const REMOVE_REVIEWERS_URL =
            "/repos/octo/test/pulls/43/requested_reviewers";
        const reviewers = {
            reviewers: ["sri85"],
        };
        it("should return empty array if the remove reviewers endpoint returns 500", async () => {
            nock(API_BASE_URL, {
                reqheaders: {
                    authorization: `token ${token}`,
                },
            })
                .delete(REMOVE_REVIEWERS_URL, reviewers)
                .reply(200, {});
            expect(
                await pullRequestObject.removeReviewers(43, ["sri85"])
            ).to.deep.equal([]);
        });
        it("should return empty array if the remove reviewers endpoint returns 500", async () => {
            nock(API_BASE_URL, {
                reqheaders: {
                    authorization: `token ${token}`,
                },
            })
                .delete(REMOVE_REVIEWERS_URL, reviewers)
                .reply(500);
            expect(
                await pullRequestObject.removeReviewers(43, ["sri85"])
            ).to.deep.equal([]);
        });
        it("should return empty array if the remove reviewers endpoint returns 400", async () => {
            nock(API_BASE_URL, {
                reqheaders: {
                    authorization: `token ${token}`,
                },
            })
                .delete(REMOVE_REVIEWERS_URL, reviewers)
                .reply(400);
            expect(
                await pullRequestObject.removeReviewers(43, ["sri85"])
            ).to.deep.equal([]);
        });
    });
});
