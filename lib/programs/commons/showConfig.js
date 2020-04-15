#!/usr/bin/env node
import program from "commander";
import clc from "cli-color";
import { org, repo } from "../../configManager/parseConfig.js";

export default function showConfig() {
    program.command("showConfig").action(() => {
        console.log(
            `Currently okgit is configured to ${clc.green(
                `${org}/${repo}`
            )} if you need to change use command ${clc.green(
                "okgit switchrepo"
            )}`
        );
    });
}
