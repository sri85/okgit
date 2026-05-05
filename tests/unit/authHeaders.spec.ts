import { expect } from "chai";
import { describe, it } from "mocha";
import {
    createGitHubAuthHeaders,
    createGitHubAuthHeadersFromConfig,
    createGitLabAuthHeaders,
    createGitLabAuthHeadersFromConfig,
} from "../../lib/api/authHeaders";
import { OkgitConfig } from "../../lib/types";

describe("auth header factories", () => {
    const config: OkgitConfig = {
        repo: "test",
        organization_username: "octo",
        personnel_access_token: "legacy-token",
        personal_access_token: "new-token",
        hosting_provider_choice: "github",
    };

    it("creates GitHub token headers", () => {
        expect(createGitHubAuthHeaders("token")).to.deep.equal({
            Authorization: "token token",
        });
    });

    it("creates GitHub headers from normalized config token preference", () => {
        expect(createGitHubAuthHeadersFromConfig(config)).to.deep.equal({
            Authorization: "token new-token",
        });
    });

    it("creates GitLab private-token headers", () => {
        expect(createGitLabAuthHeaders("token")).to.deep.equal({
            "PRIVATE-TOKEN": "token",
        });
    });

    it("creates GitLab headers from normalized config token preference", () => {
        expect(createGitLabAuthHeadersFromConfig(config)).to.deep.equal({
            "PRIVATE-TOKEN": "new-token",
        });
    });
});
