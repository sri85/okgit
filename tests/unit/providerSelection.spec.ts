import { describe, it } from "mocha";
import { expect } from "chai";
import {
    getConfiguredProvider,
    normalizeProviderName,
    UnsupportedProviderError,
} from "../../lib/providers";

describe("provider selection", () => {
    it("normalizes configured provider names", () => {
        expect(normalizeProviderName(undefined)).to.equal("github");
        expect(normalizeProviderName("")).to.equal("");
        expect(normalizeProviderName(" Github ")).to.equal("github");
        expect(normalizeProviderName("GITHUB")).to.equal("github");
    });

    it("uses GitHub for undefined, empty, and github config values", () => {
        expect(getConfiguredProvider(undefined).pullRequests).to.exist;
        expect(getConfiguredProvider("").issues).to.exist;
        expect(getConfiguredProvider("github").repositories).to.exist;
        expect(getConfiguredProvider("Github").pullRequests).to.exist;
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
