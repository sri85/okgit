import fs from "fs";
import os from "os";
import path from "path";
import { FileConfigStore } from "../config/ConfigStore";
import { assertRepositoryName } from "../utils/validators";
const homedir = os.homedir();

type TemplateType = "pullRequest" | "issue";

function githubTemplateParser(
    templateType: TemplateType,
    repoName = new FileConfigStore().readConfig().repo,
    homeDir = homedir
): string {
    if (repoName === "") {
        return "";
    }
    const templateFile = getTemplateFilePath(templateType, repoName, homeDir);
    let template = "";
    if (fs.existsSync(templateFile)) {
        template = fs.readFileSync(templateFile, "utf8");
    }
    return template;
}

function getTemplateFilePath(
    templateType: TemplateType,
    repoName: string,
    homeDir = homedir
): string {
    assertRepositoryName(repoName);
    let filePath = "";
    switch (templateType) {
        case "pullRequest":
            filePath = path.join(homeDir, `/.git-cli/${repoName}-pr-template.md`);
            break;
        case "issue":
            filePath = path.join(
                homeDir,
                `/.git-cli/${repoName}-issue-template.md`
            );
            break;
    }
    return filePath;
}

export { githubTemplateParser, getTemplateFilePath };
