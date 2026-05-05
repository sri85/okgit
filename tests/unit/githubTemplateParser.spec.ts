import { expect } from "chai";
import fs from "fs";
import { afterEach, beforeEach, describe, it } from "mocha";
import os from "os";
import path from "path";
import {
    getTemplateFilePath,
    githubTemplateParser,
} from "../../lib/parsers/githubTemplateParser";

describe("githubTemplateParser", () => {
    let tempDir: string;

    beforeEach(() => {
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "okgit-template-"));
        fs.mkdirSync(path.join(tempDir, ".git-cli"));
    });

    afterEach(() => {
        fs.rmSync(tempDir, { recursive: true, force: true });
    });

    it("builds template paths from explicit repo names", () => {
        expect(getTemplateFilePath("pullRequest", "test-repo", tempDir)).to.equal(
            path.join(tempDir, ".git-cli", "test-repo-pr-template.md")
        );
        expect(getTemplateFilePath("issue", "test-repo", tempDir)).to.equal(
            path.join(tempDir, ".git-cli", "test-repo-issue-template.md")
        );
    });

    it("rejects unsafe repo names before building template paths", () => {
        expect(() =>
            getTemplateFilePath("pullRequest", "../bad", tempDir)
        ).to.throw("Invalid repository name");
    });

    it("reads configured template content as UTF-8 text", () => {
        const templatePath = getTemplateFilePath(
            "pullRequest",
            "test-repo",
            tempDir
        );
        fs.writeFileSync(templatePath, "## Pull request\n\nBody");

        expect(githubTemplateParser("pullRequest", "test-repo", tempDir)).to.equal(
            "## Pull request\n\nBody"
        );
    });

    it("returns empty text when no repo is configured", () => {
        expect(githubTemplateParser("issue", "", tempDir)).to.equal("");
    });
});
