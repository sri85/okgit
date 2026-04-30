#!/usr/bin/env node
import program from "commander";
import cliConfig from "../questionnaire/cliConfig";
import path from "path";
import shell from "shelljs";

const homedir = require("os").homedir();

export default function createConfig() {
    program
        .command("config")
        .action(async function() {
            const config = await cliConfig();
            const repoName = config["repo"];
            const filePath = path.join(homedir, ".git-cli/");
            const pulRequestTemplateFilePath = path.join(
                filePath,
                `${repoName}-pr-template.md`
            );
            const issueTemplateFilePath = path.join(
                filePath,
                `${repoName}-issue-template.md`
            );
            console.log(`Find the issue template in ${issueTemplateFilePath}`);
            const envFile = path.join(filePath, "config.json");
            shell.echo(JSON.stringify(config)).to(envFile);
            if (config["pullRequestTemplate"] !== "") {
                shell
                    .echo(config["pullRequestTemplate"])
                    .to(pulRequestTemplateFilePath);
            }
            if (config["issueTemplate"] !== "") {
                shell.echo(config["issueTemplate"]).to(issueTemplateFilePath);
            }
        })
        .description("Configure repository");
}
