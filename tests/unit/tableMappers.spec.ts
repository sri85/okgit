import { describe, it } from "mocha";
import { expect } from "chai";
import {
    pullRequestCommentToRow,
    pullRequestCommitToRow,
    pullRequestFileToRow,
    pullRequestSummaryToRow,
} from "../../lib/tables/mappers/pullRequests";
import { issueDetailsToRow } from "../../lib/tables/mappers/issues";
import { repositoryDetailsToRow } from "../../lib/tables/mappers/repositories";

describe("table row mappers", () => {
    it("maps issue details to table rows", () => {
        expect(
            issueDetailsToRow({
                url: "https://github.com/octo/test/issues/1",
                author: "octo",
                state: "open",
            })
        ).to.deep.equal([
            "https://github.com/octo/test/issues/1",
            "octo",
            "open",
        ]);
    });

    it("maps repository details to table rows", () => {
        expect(
            repositoryDetailsToRow({
                fullName: "octo/test",
                url: "https://github.com/octo/test",
                sshUrl: "git@github.com:octo/test.git",
                forks: 1,
                openIssues: 2,
                stars: 3,
                subscribers: 4,
            })
        ).to.deep.equal([
            "octo/test",
            "https://github.com/octo/test",
            "git@github.com:octo/test.git",
            1,
            2,
            3,
            4,
        ]);
    });

    it("maps pull request summary to table rows", () => {
        expect(
            pullRequestSummaryToRow({
                merged: false,
                additions: 10,
                deletions: 2,
                changedFiles: 3,
                mergeableState: "clean",
                commits: 4,
                comments: 5,
                reviewComments: 6,
            })
        ).to.deep.equal([false, 10, 2, 3, "clean", 4, 5, 6]);
    });

    it("maps pull request comments and commits to table rows", () => {
        expect(
            pullRequestCommentToRow({
                author: "octo",
                url: "https://github.com/octo/test/pull/1#discussion",
            })
        ).to.deep.equal([
            "octo",
            "https://github.com/octo/test/pull/1#discussion",
        ]);

        expect(
            pullRequestCommitToRow({
                committer: "octo",
                message: "Add tests",
                url: "https://github.com/octo/test/commit/abc",
            })
        ).to.deep.equal([
            "octo",
            "Add tests",
            "https://github.com/octo/test/commit/abc",
        ]);
    });

    it("maps pull request files to table rows with colored diff counts", () => {
        const row = pullRequestFileToRow({
            filename: "README.md",
            status: "modified",
            additions: 1,
            deletions: 2,
            changes: 3,
        });

        expect(row[0]).to.equal("README.md");
        expect(row[1]).to.equal("modified");
        expect(String(row[2])).to.contain("1");
        expect(String(row[3])).to.contain("2");
        expect(row[4]).to.equal("modified");
        expect(row[5]).to.equal("3");
    });
});
