#!/usr/bin/env node
import program from "commander";
import { GitlabMR } from "../../../api/services/gitlab/GitlabAPI";
import createTable from "../../../tables/utils/createTable";
import printTable from "../../../tables/utils/printTable";
import { PULL_REQUEST_LIST_HEADER } from "../../../tables/utils/pullRequestTableHeaders.js";
import { org } from "../../../configManager/parseConfig";

export default function mergeRequestListProgram() {
    program
        .command("fetchMR <repo> <state>")
        .alias("p")
        .description("Get Merge Requests from a specific project")
        .action(async function(repo, state) {
            const pullRequestTable = createTable(PULL_REQUEST_LIST_HEADER);
            const pullRequestDetails = await GitlabMR.listMergeRequests(
                org,
                repo,
                state
            );
            for (let i = 0; i < pullRequestDetails.length; i++) {
                pullRequestTable.push(pullRequestDetails[i]);
            }
            printTable(pullRequestTable);
        });
}
