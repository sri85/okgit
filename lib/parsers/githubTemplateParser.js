import path from "path";
import { repo } from "../configManager/parseConfig";

const remark = require("remark");

const github = require("remark-github");
const fs = require("fs");
const homedir = require("os").homedir();

function githubTemplateParser(templateType) {
    const templateFile = getTemplateFilePath(templateType);
    let template = "";
    if (fs.existsSync(templateFile)) {
        template = remark()
            .use(github)
            .processSync(fs.readFileSync(templateFile));
    }
    return template;
}

function getTemplateFilePath(templateType) {
    let filePath;
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
