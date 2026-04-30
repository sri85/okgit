import { describe, it } from "mocha";
import { expect } from "chai";
import { mapGithubIssue } from "../../lib/providers/github/mappers/issues";
import {
    mapGithubPullRequestComment,
    mapGithubPullRequestCommit,
    mapGithubPullRequestFile,
    mapGithubPullRequestListItem,
    mapGithubPullRequestSummary,
} from "../../lib/providers/github/mappers/pullRequests";
import { mapGithubRepositoryDetails } from "../../lib/providers/github/mappers/repositories";

describe("GitHub provider mappers", () => {
    it("maps issue responses to issue details", () => {
        expect(
            mapGithubIssue({
                html_url: "https://github.com/octo/test/issues/17",
                user: {
                    login: "octo",
                },
                state: "open",
            })
        ).to.deep.equal({
            url: "https://github.com/octo/test/issues/17",
            author: "octo",
            state: "open",
        });
    });

    it("maps pull request list responses to list items", () => {
        expect(
            mapGithubPullRequestListItem(
                {
                    html_url: "https://github.com/octo/test/pull/43",
                    created_at: "2020-02-13T17:57:54Z",
                    user: {
                        login: "sripathipai",
                    },
                },
                "open",
                () => "12 days ago"
            )
        ).to.deep.equal({
            url: "https://github.com/octo/test/pull/43",
            state: "open",
            author: "sripathipai",
            createdAt: "12 days ago",
        });
    });

    it("maps pull request comments without a user to unknown author", () => {
        expect(
            mapGithubPullRequestComment({
                html_url:
                    "https://github.com/octo/test/pull/10#discussion_r320187757",
                user: null,
            })
        ).to.deep.equal({
            author: "Unknown User",
            url: "https://github.com/octo/test/pull/10#discussion_r320187757",
        });
    });

    it("maps pull request summaries", () => {
        expect(
            mapGithubPullRequestSummary({
                merged: false,
                additions: 126,
                deletions: 284,
                changed_files: 16,
                mergeable_state: "behind",
                commits: 6,
                comments: 1,
                review_comments: 3,
            })
        ).to.deep.equal({
            merged: false,
            additions: 126,
            deletions: 284,
            changedFiles: 16,
            mergeableState: "behind",
            commits: 6,
            comments: 1,
            reviewComments: 3,
        });
    });

    it("maps pull request commits", () => {
        expect(
            mapGithubPullRequestCommit({
                html_url: "https://github.com/octo/test/commit/abc123",
                commit: {
                    committer: {
                        name: "sri85",
                    },
                    message: "test commit",
                },
            })
        ).to.deep.equal({
            committer: "sri85",
            message: "test commit",
            url: "https://github.com/octo/test/commit/abc123",
        });
    });

    it("maps pull request files", () => {
        expect(
            mapGithubPullRequestFile({
                filename: "README.md",
                status: "modified",
                additions: 1,
                deletions: 0,
                changes: 1,
            })
        ).to.deep.equal({
            filename: "README.md",
            status: "modified",
            additions: 1,
            deletions: 0,
            changes: 1,
        });
    });

    it("maps repository details", () => {
        expect(
            mapGithubRepositoryDetails({
                full_name: "octo/test",
                html_url: "https://github.com/octo/test",
                ssh_url: "git@github.com:octo/test.git",
                forks: 23,
                open_issues: 0,
                stargazers_count: 45,
                subscribers_count: 56,
            })
        ).to.deep.equal({
            fullName: "octo/test",
            url: "https://github.com/octo/test",
            sshUrl: "git@github.com:octo/test.git",
            forks: 23,
            openIssues: 0,
            stars: 45,
            subscribers: 56,
        });
    });
});
