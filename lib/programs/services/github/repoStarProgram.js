#!/usr/bin/env node
import program from "commander";
import { printUpdateRepoTable } from "../../../tables/printUpdateRepoTable.js";

export default function repoDetailsProgram() {
    program
        .command("repo <repoName>")
        .option("-s --star", "Star a repository")
        .option("-u --unstar", "Unstar a repository")
        .option("-e --enableScan", "Enable vulnerability scan for the repo")
        .action(async function(repoName, cmdObj) {
            if (cmdObj["star"]) {
                await printUpdateRepoTable("star", repoName);
            } else if (cmdObj["unstar"]) {
                await printUpdateRepoTable("unstar", repoName);
            } else if (cmdObj["enable"]) {
                await printUpdateRepoTable("enable", repoName);
            }
        });
}
