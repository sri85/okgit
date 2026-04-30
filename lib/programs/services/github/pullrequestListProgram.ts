#!/usr/bin/env node
import program from "commander";
import createTable from "../../../tables/utils/createTable";
import printTable from "../../../tables/utils/printTable";
import { PULL_REQUEST_LIST_HEADER } from "../../../tables/utils/pullRequestTableHeaders";
import { listPullRequests } from "../../../application/usecases/pullRequests";

async function listPullRequestsAction(repo: string, state: string | undefined) {
    const pullRequestTable = createTable(PULL_REQUEST_LIST_HEADER);
    const pullRequestDetails = await listPullRequests(repo, state);
    for (const pullRequestDetail of pullRequestDetails) {
        pullRequestTable.push([
            pullRequestDetail.url,
            pullRequestDetail.state,
            pullRequestDetail.author,
            pullRequestDetail.createdAt,
        ]);
    }
    printTable(pullRequestTable);
}

export default function listPullRequestProgram() {
    program
        .command("fetchPR <repo> [state]")
        .alias("p")
        .description("Get PR from a specific repo")
        .action(async function(repo: string, state: string | undefined) {
            await listPullRequestsAction(repo, state);
        });

    program
        .command("pull-requests <repo> [state]")
        .description("List pull requests for a repository")
        .action(async function(repo: string, state: string | undefined) {
            await listPullRequestsAction(repo, state);
        });
}
