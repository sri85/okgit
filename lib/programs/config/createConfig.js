#!/usr/bin/env node
import program from "commander";
import cliConfig from "../questionnaire/cliConfig";
import path from "path";
import shell from "shelljs";

const homedir = require("os").homedir();

export default function createConfig() {
    program.command("config").action(async function() {
        const config = await cliConfig();
        const filePath = path.join(homedir, ".git-cli/");
        const envFile = path.join(filePath, "config.json");
        shell.echo(JSON.stringify(config)).to(envFile);
    });
}
