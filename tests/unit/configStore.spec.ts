import { expect } from "chai";
import fs from "fs";
import { afterEach, beforeEach, describe, it } from "mocha";
import os from "os";
import path from "path";
import {
    ConfigReadError,
    ConfigValidationError,
    FileConfigStore,
    getDefaultConfig,
    requireConfigToken,
    resolveDefaultConfigPath,
} from "../../lib/config/ConfigStore";
import { OkgitConfig } from "../../lib/types";

describe("FileConfigStore", () => {
    let tempDir: string;
    let configPath: string;

    beforeEach(() => {
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "okgit-store-"));
        configPath = path.join(tempDir, "config.json");
    });

    afterEach(() => {
        fs.rmSync(tempDir, { recursive: true, force: true });
    });

    function createConfig(overrides: Partial<OkgitConfig> = {}): OkgitConfig {
        return {
            repo: "test-repo",
            organization_username: "octo",
            personnel_access_token: "legacy-token",
            personal_access_token: "new-token",
            hosting_provider_choice: "github",
            ...overrides,
        };
    }

    it("resolves the default config path under the okgit config directory", () => {
        expect(resolveDefaultConfigPath("/tmp/home")).to.equal(
            path.join("/tmp/home", ".git-cli", "config.json")
        );
    });

    it("returns a default config when the file does not exist", () => {
        const store = new FileConfigStore(configPath);

        expect(store.readConfig()).to.deep.equal(getDefaultConfig());
    });

    it("reads and normalizes legacy token configs", () => {
        fs.writeFileSync(
            configPath,
            JSON.stringify(createConfig({ personal_access_token: undefined }))
        );
        const store = new FileConfigStore(configPath);

        expect(store.readConfig()).to.deep.equal({
            ...createConfig(),
            personal_access_token: "legacy-token",
            personnel_access_token: "legacy-token",
        });
    });

    it("writes config files with restrictive permissions", () => {
        const store = new FileConfigStore(configPath);

        store.writeConfig(createConfig());

        const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
        expect(config.personal_access_token).to.equal("new-token");
        expect(config.personnel_access_token).to.equal("new-token");
        expect(fs.statSync(tempDir).mode & 0o777).to.equal(0o700);
        expect(fs.statSync(configPath).mode & 0o777).to.equal(0o600);
    });

    it("updates config with a mutator", () => {
        const store = new FileConfigStore(configPath);
        store.writeConfig(createConfig());

        const updatedConfig = store.updateConfig(config => ({
            ...config,
            repo: "other-repo",
        }));

        expect(updatedConfig.repo).to.equal("other-repo");
        expect(store.readConfig().repo).to.equal("other-repo");
    });

    it("rejects invalid config values", () => {
        const store = new FileConfigStore(configPath);

        expect(() =>
            store.writeConfig(createConfig({ repo: "../bad" }))
        ).to.throw(ConfigValidationError, "Invalid repository name");
        expect(() =>
            store.writeConfig(
                createConfig({
                    hosting_provider_choice:
                        "other" as unknown as OkgitConfig["hosting_provider_choice"],
                })
            )
        ).to.throw(ConfigValidationError, "Unsupported hosting provider");
    });

    it("throws a read error for malformed JSON", () => {
        fs.writeFileSync(configPath, "{");
        const store = new FileConfigStore(configPath);

        expect(() => store.readConfig()).to.throw(ConfigReadError);
    });

    it("requires a token for API-backed commands", () => {
        expect(() =>
            requireConfigToken(
                createConfig({
                    personal_access_token: "",
                    personnel_access_token: "",
                })
            )
        ).to.throw(ConfigValidationError, "Missing personal access token");
    });
});
