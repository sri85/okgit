#!/usr/bin/env node
import program from "commander";

import { printIssueDetailsTable } from "../../../tables/printIssueDetailsTable";

export default function listIssues() {
    program
        .command("list-issues")
        .description("List issue from a repository")
        .alias("l")
        .action(async function() {
            await printIssueDetailsTable("list");
        });
}
