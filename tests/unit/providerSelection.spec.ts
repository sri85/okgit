import { afterEach, describe, it } from "mocha";
import { expect } from "chai";
import nock from "nock";
import {
    getConfiguredProviderFromConfig,
    getConfiguredProvider,
    normalizeProviderName,
    UnsupportedProviderError,
} from "../../lib/providers";
import { OkgitConfig } from "../../lib/types";

const githubConfig: OkgitConfig = {
    repo: "test",
    organization_username: "octo",
    personnel_access_token: "token",
    personal_access_token: "token",
    hosting_provider_choice: "github",
};

describe("provider selection", () => {
    afterEach(() => {
        nock.cleanAll();
    });

    it("normalizes configured provider names", () => {
        expect(normalizeProviderName(undefined)).to.equal("github");
        expect(normalizeProviderName("")).to.equal("");
        expect(normalizeProviderName(" Github ")).to.equal("github");
        expect(normalizeProviderName("GITHUB")).to.equal("github");
    });

    it("uses GitHub for undefined, empty, and github config values", () => {
        expect(getConfiguredProvider(undefined, githubConfig).pullRequests).to
            .exist;
        expect(getConfiguredProvider("", githubConfig).issues).to.exist;
        expect(getConfiguredProvider("github", githubConfig).repositories).to
            .exist;
        expect(getConfiguredProvider("Github", githubConfig).pullRequests).to
            .exist;
    });

    it("can select a provider directly from config", () => {
        expect(getConfiguredProviderFromConfig(githubConfig).repositories).to
            .exist;
    });

    it("configures GitHub providers from explicit config values", async () => {
        nock("https://api.github.com", {
            reqheaders: {
                authorization: "token explicit-token",
            },
        })
            .get("/repos/explicit-owner/explicit-repo/pulls")
            .query({ state: "open" })
            .reply(200, [
                {
                    html_url: "https://github.com/explicit-owner/explicit-repo/pull/1",
                    created_at: "2026-05-01T00:00:00Z",
                    user: { login: "octocat" },
                },
            ]);

        const provider = getConfiguredProviderFromConfig({
            ...githubConfig,
            repo: "explicit-repo",
            organization_username: "explicit-owner",
            personnel_access_token: "explicit-token",
            personal_access_token: "explicit-token",
        });

        const pullRequests = await provider.pullRequests.listPullRequests(
            "explicit-repo",
            "open"
        );

        expect(pullRequests).to.have.length(1);
        const [pullRequest] = pullRequests;
        expect(pullRequest).to.not.equal(undefined);
        expect(pullRequest?.author).to.equal("octocat");
        expect(nock.isDone()).to.equal(true);
    });

    it("does not silently fall back to GitHub for unsupported providers", () => {
        expect(() => getConfiguredProvider("gitlab")).to.throw(
            UnsupportedProviderError,
            "Unsupported hosting provider: gitlab"
        );
        expect(() => getConfiguredProvider("gitub")).to.throw(
            UnsupportedProviderError,
            "Unsupported hosting provider: gitub"
        );
    });
});
