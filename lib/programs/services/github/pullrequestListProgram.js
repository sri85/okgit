#!/usr/bin/env node
import program from "commander";
import shell from "shelljs";
import { GithubPR } from "../../../api/services/github/GitHubAPI.js";
import createTable from "../../../tables/utils/createTable";
import printTable from "../../../tables/utils/printTable";
import { PULL_REQUEST_LIST_HEADER } from "../../../tables/utils/pullRequestTableHeaders.js";

export default function listPullRequestProgram() {
    program
        .command("fetchPR <repo> <state>")
        .alias("p")
        .description("Get PR from a specific repo")
        .action(async function(repo, state) {
            shell.exec("git symbolic-ref --short HEAD");
            const pullRequestTable = createTable(PULL_REQUEST_LIST_HEADER);
            const pullRequestDetails = await GithubPR.getPullRequests(
                repo,
                state
            );
            for (let i = 0; i < pullRequestDetails.length; i++) {
                pullRequestTable.push(pullRequestDetails[i]);
            }
            printTable(pullRequestTable);
        });
}
