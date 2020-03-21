#!/usr/bin/env node
import program from "commander";

import { printIssueDetailsTable } from "../../../tables/printIssueDetailsTable";
import { printUpdateIssueDetailsTable } from "../../../tables/printUpdateIssueDetailsTable";
import { openLink } from "../../../tables/openLink";

export default function issueDetails() {
    program
        .command("issue <id>")
        .option("-s --state <state>", "Close/Reopen Issues")
        .option("-d --details", "Issue details")
        .option("-a --assign <assign>", "Assign User(s) to issue")
        .option("-l --label <label>", "Add label(s) to issue")
        .option("-w --web", "Open the issue in web browser")
        .action(async function(issueId, cmdObj) {
            cmdObj["state"]
                ? await printUpdateIssueDetailsTable(
                      "close",
                      issueId,
                      cmdObj.state
                  )
                : "";
            cmdObj["details"]
                ? await printIssueDetailsTable("details", issueId)
                : "";
            cmdObj["assign"]
                ? await printUpdateIssueDetailsTable(
                      "assign",
                      issueId,
                      cmdObj.assign.split(",")
                  )
                : "";
            cmdObj["label"]
                ? await printUpdateIssueDetailsTable(
                      "label",
                      issueId,
                      cmdObj.label.split(",")
                  )
                : "";
            cmdObj["web"] ? await openLink("issue", issueId) : "";
        });
}
