import { expect } from "chai";
import nock from "nock";
import { afterEach, describe, it } from "mocha";
import {
    createGitHubHttpClient,
    createGitLabHttpClient,
} from "../../lib/api/providerHttpClients";
import { OkgitConfig } from "../../lib/types";

describe("provider HTTP clients", () => {
    const config: OkgitConfig = {
        repo: "test",
        organization_username: "octo",
        personnel_access_token: "legacy-token",
        personal_access_token: "new-token",
        hosting_provider_choice: "github",
    };

    afterEach(() => {
        nock.cleanAll();
    });

    it("creates a GitHub client with GitHub base URL and token auth", async () => {
        nock("https://api.github.com", {
            reqheaders: {
                authorization: "token new-token",
            },
        })
            .get("/repos/octo/test")
            .reply(200, { ok: true });

        const response = await createGitHubHttpClient(config).get<{ ok: boolean }>(
            "/test"
        );

        expect(response.ok).to.equal(true);
        expect(nock.isDone()).to.equal(true);
    });

    it("creates a GitLab client with GitLab base URL and private-token auth", async () => {
        nock("https://gitlab.com/api/v4", {
            reqheaders: {
                "private-token": "new-token",
            },
        })
            .get("/projects")
            .reply(200, [{ id: 1 }]);

        const response = await createGitLabHttpClient({
            ...config,
            hosting_provider_choice: "gitlab",
        }).get<Array<{ id: number }>>("/projects");

        expect(response[0]?.id).to.equal(1);
        expect(nock.isDone()).to.equal(true);
    });
});
