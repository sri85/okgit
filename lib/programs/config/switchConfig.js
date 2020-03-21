#!/usr/bin/env node
import program from "commander";
import path from "path";
import shell from "shelljs";
const fs = require("fs");

import switchConfigQuestionnaire from "../questionnaire/switchConfigQuestionnaire";

const homedir = require("os").homedir();

export default function switchRepoConfig() {
    program.command("switchrepo").action(async function() {
        const conf = await switchConfigQuestionnaire();
        const filePath = path.join(homedir, ".git-cli/");
        const envFile = path.join(filePath, "config.json");
        const data = fs.readFileSync(envFile, "utf-8");
        const newOrgName = conf["organization_username"];
        const splitName = newOrgName.split("/");
        const words = JSON.parse(data);
        const oldOrgName = words["organization_username"];
        const oldRepoName = words["repo"];
        shell.sed("-i", oldOrgName, splitName[0], envFile);
        shell.sed("-i", oldRepoName, splitName[1], envFile);
        const newData = fs.readFileSync(envFile, "utf-8");
        const configJson = JSON.parse(newData);
        shell.echo(
            `Switched successfully to ${configJson["organization_username"]}/${configJson["repo"]}`
        );
    });
}
