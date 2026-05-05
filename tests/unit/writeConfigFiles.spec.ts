import { describe, it, afterEach } from "mocha";
import { expect } from "chai";
import fs from "fs";
import os from "os";
import path from "path";
import {
    createConfigFilePaths,
    writeConfigFiles,
} from "../../lib/configManager/writeConfigFiles";
import { OkgitConfig } from "../../lib/types";

const tempDirs: string[] = [];

function createTempDir(): string {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "okgit-config-"));
    tempDirs.push(tempDir);
    return tempDir;
}

function fileMode(filePath: string): number {
    return fs.statSync(filePath).mode & 0o777;
}

describe("writeConfigFiles", () => {
    afterEach(() => {
        for (const tempDir of tempDirs.splice(0)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
    });

    it("creates config paths from safe repo names", () => {
        const paths = createConfigFilePaths("/tmp/okgit", "test-repo");

        expect(paths.configFilePath).to.equal("/tmp/okgit/config.json");
        expect(paths.issueTemplateFilePath).to.equal(
            "/tmp/okgit/test-repo-issue-template.md"
        );
        expect(paths.pullRequestTemplateFilePath).to.equal(
            "/tmp/okgit/test-repo-pr-template.md"
        );
    });

    it("rejects unsafe repo names before writing files", () => {
        expect(() =>
            createConfigFilePaths("/tmp/okgit", "../unsafe")
        ).to.throw("Invalid repository name");
    });

    it("writes config and templates with restrictive permissions", () => {
        const configDir = path.join(createTempDir(), ".git-cli");
        const config: OkgitConfig = {
            repo: "test",
            organization_username: "octo",
            personnel_access_token: "secret",
            hosting_provider_choice: "Github",
            pullRequestTemplate: "PR template",
            issueTemplate: "Issue template",
        };

        const paths = writeConfigFiles(configDir, config);
        const persistedConfig = JSON.parse(
            fs.readFileSync(paths.configFilePath, "utf-8")
        ) as OkgitConfig;

        expect(fileMode(configDir)).to.equal(0o700);
        expect(fileMode(paths.configFilePath)).to.equal(0o600);
        expect(fileMode(paths.pullRequestTemplateFilePath)).to.equal(0o600);
        expect(fileMode(paths.issueTemplateFilePath)).to.equal(0o600);
        expect(persistedConfig).to.deep.equal({
            ...config,
            personal_access_token: "secret",
        });
        expect(
            fs.readFileSync(paths.pullRequestTemplateFilePath, "utf-8")
        ).to.equal("PR template");
        expect(fs.readFileSync(paths.issueTemplateFilePath, "utf-8")).to.equal(
            "Issue template"
        );
    });

    it("does not create blank template files", () => {
        const configDir = path.join(createTempDir(), ".git-cli");
        const config: OkgitConfig = {
            repo: "test",
            organization_username: "octo",
            personnel_access_token: "secret",
            hosting_provider_choice: "Github",
            pullRequestTemplate: "",
            issueTemplate: "",
        };

        const paths = writeConfigFiles(configDir, config);

        expect(fs.existsSync(paths.configFilePath)).to.equal(true);
        expect(fs.existsSync(paths.pullRequestTemplateFilePath)).to.equal(
            false
        );
        expect(fs.existsSync(paths.issueTemplateFilePath)).to.equal(false);
    });
});
