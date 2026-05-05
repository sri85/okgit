#!/usr/bin/env node
import program from "commander";
import cliConfig from "../questionnaire/cliConfig";
import path from "path";
import { writeConfigFiles } from "../../configManager/writeConfigFiles";

const homedir = require("os").homedir();

export default function createConfig() {
    program
        .command("config")
        .action(async function() {
            const config = await cliConfig();
            const filePath = path.join(homedir, ".git-cli/");
            const writtenPaths = writeConfigFiles(filePath, config);
            console.log(
                `Find the issue template in ${writtenPaths.issueTemplateFilePath}`
            );
        })
        .description("Configure repository");
}
