import { describe, it } from "mocha";
import { expect } from "chai";
import {
    getConfigToken,
    normalizeTokenConfig,
    redactConfig,
} from "../../lib/configManager/tokenConfig";
import {
    formatCurrentConfig,
    formatRedactedConfig,
} from "../../lib/programs/commons/showConfig";
import { OkgitConfig } from "../../lib/types";

describe("token config helpers", () => {
    const legacyConfig: OkgitConfig = {
        repo: "test",
        organization_username: "octo",
        personnel_access_token: "legacy-secret",
        hosting_provider_choice: "Github",
    };

    it("reads the new token key before the legacy misspelled key", () => {
        expect(
            getConfigToken({
                ...legacyConfig,
                personal_access_token: "new-secret",
            })
        ).to.equal("new-secret");
        expect(getConfigToken(legacyConfig)).to.equal("legacy-secret");
    });

    it("normalizes token config to include both new and legacy keys", () => {
        expect(normalizeTokenConfig(legacyConfig)).to.deep.include({
            personal_access_token: "legacy-secret",
            personnel_access_token: "legacy-secret",
        });
    });

    it("redacts both token keys", () => {
        expect(
            redactConfig({
                ...legacyConfig,
                personal_access_token: "new-secret",
            })
        ).to.deep.include({
            personal_access_token: "<redacted>",
            personnel_access_token: "<redacted>",
        });
    });

    it("formats current config without token values", () => {
        const formatted = formatCurrentConfig("octo", "test");

        expect(formatted).to.contain("octo/test");
        expect(formatted).to.not.contain("secret");
    });

    it("formats detailed config with redacted token values", () => {
        const formatted = formatRedactedConfig({
            ...legacyConfig,
            personal_access_token: "new-secret",
        });

        expect(formatted).to.contain("<redacted>");
        expect(formatted).to.not.contain("new-secret");
        expect(formatted).to.not.contain("legacy-secret");
    });
});
