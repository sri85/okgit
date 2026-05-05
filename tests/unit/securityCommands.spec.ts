import { describe, it, afterEach } from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import {
    buildGitHubWebUrl,
    createOpenCommand,
    openLink,
} from "../../lib/tables/openLink";
import { checkoutPullRequest } from "../../lib/tables/printCheckoutPR";
import { ExecFileRunner } from "../../lib/utils/execFile";
import { parsePositiveIntegerId } from "../../lib/utils/validators";

describe("secure command helpers", () => {
    afterEach(() => {
        sinon.restore();
    });

    it("builds GitHub web URLs from validated components", () => {
        expect(buildGitHubWebUrl("octo", "test", "repo")).to.equal(
            "https://github.com/octo/test"
        );
        expect(buildGitHubWebUrl("octo", "test", "pr", 12)).to.equal(
            "https://github.com/octo/test/pull/12"
        );
        expect(buildGitHubWebUrl("octo", "test", "issue", "17")).to.equal(
            "https://github.com/octo/test/issues/17"
        );
    });

    it("rejects unsafe GitHub URL components", () => {
        expect(() =>
            buildGitHubWebUrl("octo; rm -rf /", "test", "repo")
        ).to.throw("Invalid GitHub owner");
        expect(() =>
            buildGitHubWebUrl("octo", "test; rm -rf /", "repo")
        ).to.throw("Invalid repository name");
        expect(() => buildGitHubWebUrl("octo", "test", "pr", "1;whoami")).to.throw(
            "Expected a positive integer id"
        );
    });

    it("normalizes positive integer ids and rejects unsafe ids", () => {
        expect(parsePositiveIntegerId(42)).to.equal("42");
        expect(parsePositiveIntegerId("42")).to.equal("42");
        expect(() => parsePositiveIntegerId("0")).to.throw(
            "Expected a positive integer id"
        );
        expect(() => parsePositiveIntegerId("12 --help")).to.throw(
            "Expected a positive integer id"
        );
    });

    it("creates open commands with argument arrays", () => {
        const command = createOpenCommand("https://github.com/octo/test");

        expect(command.args).to.include("https://github.com/octo/test");
        expect(command.args.join(" ")).to.not.contain(";");
    });

    it("opens links through an execFile-style runner", async () => {
        const calls: Array<{ command: string; args: string[] }> = [];
        const runner: ExecFileRunner = async (command, args) => {
            calls.push({ command, args });
        };
        const log = sinon.stub(console, "log");

        const config = {
            repo: "test",
            organization_username: "octo",
            personnel_access_token: "token",
            personal_access_token: "token",
            hosting_provider_choice: "github" as const,
        };

        await openLink("pr", 12, runner, {
            readConfig: () => config,
            writeConfig: () => undefined,
            updateConfig: mutator => mutator(config),
        });

        expect(calls).to.have.length(1);
        const openCall = calls[0];
        if (openCall === undefined) {
            throw new Error("Expected open command to be called");
        }
        expect(openCall.args).to.include(
            "https://github.com/octo/test/pull/12"
        );
        expect(log.calledOnceWithExactly("Bye for now 😉")).to.equal(true);
    });

    it("checks out pull requests through git argument arrays", async () => {
        const calls: Array<{ command: string; args: string[] }> = [];
        const runner: ExecFileRunner = async (command, args) => {
            calls.push({ command, args });
        };

        await checkoutPullRequest("12", runner);

        expect(calls).to.deep.equal([
            {
                command: "git",
                args: ["fetch", "origin", "pull/12/head:pr-12"],
            },
            {
                command: "git",
                args: ["checkout", "pr-12"],
            },
        ]);
    });

    it("rejects unsafe pull request ids before running git", async () => {
        const runner = sinon.stub();

        try {
            await checkoutPullRequest("12;whoami", runner);
            throw new Error("Expected checkoutPullRequest to reject");
        } catch (err) {
            expect((err as Error).message).to.contain(
                "Expected a positive integer id"
            );
        }
        expect(runner.notCalled).to.equal(true);
    });
});
