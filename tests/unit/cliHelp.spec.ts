import { before, describe, it } from "mocha";
import { expect } from "chai";
import { execFileSync } from "child_process";
import path from "path";

function runCliHelp(...args: string[]): string {
    return execFileSync(
        process.execPath,
        ["-r", "ts-node/register", path.join("lib", "cli.ts"), ...args],
        {
            cwd: process.cwd(),
            env: {
                ...process.env,
                IS_TESTING: "TRUE",
                NO_COLOR: "1",
            },
            encoding: "utf-8",
        }
    );
}

describe("CLI help", () => {
    let rootHelp: string;
    let prHelp: string;
    let repoHelp: string;
    let issueHelp: string;

    before(function() {
        this.timeout(15000);
        rootHelp = runCliHelp("--help");
        prHelp = runCliHelp("pr", "--help");
        repoHelp = runCliHelp("repo", "--help");
        issueHelp = runCliHelp("issue", "--help");
    });

    it("keeps legacy commands and newer aliases registered", () => {
        expect(rootHelp).to.contain("fetchPR|p <repo> [state]");
        expect(rootHelp).to.contain("createPR");
        expect(rootHelp).to.contain("list-issues|l");
        expect(rootHelp).to.contain("repo-details|r <repo>");

        expect(rootHelp).to.contain("pull-requests <repo> [state]");
        expect(rootHelp).to.contain("create-pr");
        expect(rootHelp).to.contain("issues");
        expect(rootHelp).to.contain("repository-details <repo>");
    });

    it("registers pr summary without reusing the state short option", () => {
        expect(prHelp).to.contain("--summary");
        expect(prHelp).to.contain("-s, --state <state>");
        expect(prHelp).to.not.contain("-s, --summary");
    });

    it("registers repo enableScan under the expected option key", () => {
        expect(repoHelp).to.contain("-e, --enableScan");
    });

    it("registers normalized issue command options", () => {
        expect(issueHelp).to.contain("-s, --state <state>");
        expect(issueHelp).to.contain("-d, --details");
        expect(issueHelp).to.contain("-a, --assign <assign>");
        expect(issueHelp).to.contain("-l, --label <label>");
        expect(issueHelp).to.contain("-w, --web");
    });
});
