#!/usr/bin/env node
import program from "commander";

import { printPullRequestUpdateTable } from "../../../tables/printPullRequestUpdateTable";
import { printPullRequestAddRemoveReviewersTable } from "../../../tables/printPullRequestAddRemoveReviewersTable";
import { printPullRequestRemoveReviewersTable } from "../../../tables/printPullRequestRemoveReviewers";
import { printPullRequestMergeTable } from "../../../tables/printPullRequestMergeTable";
import { printPullRequestDetails } from "../../../tables/printPullRequestDetails";
import { printCheckoutPR } from "../../../tables/printCheckoutPR";
import { openLink } from "../../../tables/openLink";

export default function prDetails() {
    program
        .command("pr <id>")
        .option("-c, --comments", "Show PR comments")
        .option("-i --commits", "Show PR commits")
        .option("-s --summary", "Show PR Summary")
        .option("-f --files", "Show changed files")
        .option("-s --state <state>", "Close/Reopen Pull Request")
        .option("-a --addReviewers <addReviewers>", "Add Reviewers")
        .option("-r --removeReviewers <removeReviewers>", "Remove Reviewers")
        .option("-m --merge", "Merge Pull Request")
        .option("-o --checkout", "Checkout a Pull Request locally")
        .option("-w --web", "Open Pull Request in Browser")
        .action(async function(prId, cmdObj) {
            cmdObj["comments"]
                ? await printPullRequestDetails("comments", prId)
                : "";
            cmdObj["commits"]
                ? await printPullRequestDetails("commits", prId)
                : "";
            cmdObj["summary"]
                ? await printPullRequestDetails("summary", prId)
                : "";
            cmdObj["files"] ? await printPullRequestDetails("files", prId) : "";
            cmdObj["state"]
                ? await printPullRequestUpdateTable(prId, cmdObj.state)
                : "";
            cmdObj["addReviewers"]
                ? await printPullRequestAddRemoveReviewersTable(
                      prId,
                      cmdObj.addReviewers.split(",")
                  )
                : "";
            cmdObj["removeReviewers"]
                ? await printPullRequestRemoveReviewersTable(
                      prId,
                      cmdObj.removeReviewers.split(",")
                  )
                : "";
            cmdObj["merge"] ? await printPullRequestMergeTable(prId) : "";
            cmdObj["checkout"] ? await printCheckoutPR(prId) : "";
            cmdObj["web"] ? await openLink("pr", prId) : "";
        })
        .description("Perform operations on pull request");
}
