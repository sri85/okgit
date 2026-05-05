import { describe, it, afterEach } from "mocha";
import { expect } from "chai";
import fs from "fs";
import os from "os";
import path from "path";
import {
    parseRepoReference,
    switchConfig,
    switchConfigFile,
} from "../../lib/configManager/switchConfigFile";
import { OkgitConfig } from "../../lib/types";

const tempDirs: string[] = [];

function createTempDir(): string {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "okgit-test-"));
    tempDirs.push(tempDir);
    return tempDir;
}

describe("switchConfigFile", () => {
    afterEach(() => {
        for (const tempDir of tempDirs.splice(0)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
    });

    it("parses owner/repo references", () => {
        expect(parseRepoReference("octo/test")).to.deep.equal({
            owner: "octo",
            repo: "test",
        });
        expect(parseRepoReference(" octo/test ")).to.deep.equal({
            owner: "octo",
            repo: "test",
        });
    });

    it("rejects malformed or unsafe repo references", () => {
        expect(() => parseRepoReference("octo")).to.throw(
            "Expected repository reference in the format owner/repo"
        );
        expect(() => parseRepoReference("octo/")).to.throw(
            "Expected repository reference in the format owner/repo"
        );
        expect(() => parseRepoReference("octo/test/extra")).to.throw(
            "Expected repository reference in the format owner/repo"
        );
        expect(() => parseRepoReference("octo;whoami/test")).to.throw(
            "Invalid GitHub owner"
        );
        expect(() => parseRepoReference("octo/test;whoami")).to.throw(
            "Invalid repository name"
        );
    });

    it("updates config objects without changing unrelated fields", () => {
        const config: OkgitConfig = {
            repo: "old-repo",
            organization_username: "old-owner",
            personnel_access_token: "secret",
            hosting_provider_choice: "Github",
            pullRequestTemplate: "template",
        };

        expect(switchConfig(config, "octo/test")).to.deep.equal({
            repo: "test",
            organization_username: "octo",
            personnel_access_token: "secret",
            hosting_provider_choice: "Github",
            pullRequestTemplate: "template",
        });
    });

    it("rewrites config JSON structurally", () => {
        const tempDir = createTempDir();
        const configFilePath = path.join(tempDir, "config.json");
        fs.writeFileSync(
            configFilePath,
            JSON.stringify({
                repo: "old-repo",
                organization_username: "old-owner",
                personnel_access_token: "secret",
                hosting_provider_choice: "Github",
            })
        );

        const updatedConfig = switchConfigFile(configFilePath, "octo/test");
        const persistedConfig = JSON.parse(
            fs.readFileSync(configFilePath, "utf-8")
        ) as OkgitConfig;

        expect(updatedConfig.repo).to.equal("test");
        expect(updatedConfig.organization_username).to.equal("octo");
        expect(updatedConfig.personnel_access_token).to.equal("secret");
        expect(persistedConfig).to.deep.equal(updatedConfig);
    });
});
