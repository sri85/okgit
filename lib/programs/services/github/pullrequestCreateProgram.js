#!/usr/bin/env node
import program from "commander";
import { GithubPR } from "../../../api/services/github/GitHubAPI.js";
import prCreator from "../../questionnaire/pullRequestQuestionnaire";
import shell from "shelljs";
export default function createPullRequest() {
    program.command("create").action(async function() {
        shell.exec("git rev-parse --abbrev-ref HEAD | pbcopy");

        const prDetails = await prCreator();
        await GithubPR.createPullRequest(
            prDetails["title"],
            prDetails["current_branch"],
            prDetails["remote_branch"]
        );
    });
}
