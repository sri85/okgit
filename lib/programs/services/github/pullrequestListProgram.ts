#!/usr/bin/env node
import program from "commander";
import { GithubPR } from "../../../api/services/github/GitHubAPI";
import createTable from "../../../tables/utils/createTable";
import printTable from "../../../tables/utils/printTable";
import { PULL_REQUEST_LIST_HEADER } from "../../../tables/utils/pullRequestTableHeaders";

export default function listPullRequestProgram() {
    program
        .command("fetchPR <repo> <state>")
        .alias("p")
        .description("Get PR from a specific repo")
        .action(async function(repo: string, state: string) {
            const pullRequestTable = createTable(PULL_REQUEST_LIST_HEADER);
            const pullRequestDetails = await GithubPR.getPullRequests(
                repo,
                state
            );
            for (const pullRequestDetail of pullRequestDetails) {
                pullRequestTable.push(pullRequestDetail.map(String));
            }
            printTable(pullRequestTable);
        });
}
