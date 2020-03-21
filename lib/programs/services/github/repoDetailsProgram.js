#!/usr/bin/env node
import program from "commander";
import { printRepoDetailsTable } from "../../../tables/printRepoDetails";

export default function repoDetailsProgram() {
    program
        .command("repo-details <repo>")
        .alias("r")
        .description("Get repo details")
        .action(async function(repo) {
            await printRepoDetailsTable("list", repo, undefined);
        });
}
