import path from "path";
import { repo } from "../configManager/parseConfig";
import fs from "fs";
import os from "os";

const remark = require("remark");

const github = require("remark-github");
const homedir = os.homedir();

type TemplateType = "pullRequest" | "issue";

function githubTemplateParser(templateType: TemplateType): string {
    const templateFile = getTemplateFilePath(templateType);
    let template = "";
    if (fs.existsSync(templateFile)) {
        template = remark()
            .use(github)
            .processSync(fs.readFileSync(templateFile));
    }
    return template;
}

function getTemplateFilePath(templateType: TemplateType): string {
    let filePath = "";
    switch (templateType) {
        case "pullRequest":
            filePath = path.join(homedir, `/.git-cli/${repo}-pr-template.md`);
            break;
        case "issue":
            filePath = path.join(
                homedir,
                `/.git-cli/${repo}-issue-template.md`
            );
            break;
    }
    return filePath;
}

export { githubTemplateParser };
