#!/usr/bin/env node
import program from "commander";
import { GithubPR } from "../../../api/services/github/GitHubAPI.js";
import prCreator from "../../questionnaire/pullRequestQuestionnaire";

export default function createPullRequest() {
    program
        .command("createPR")
        .action(async function() {
            const prDetails = await prCreator();
            await GithubPR.createPullRequest(
                prDetails["title"],
                prDetails["current_branch"],
                prDetails["remote_branch"],
                prDetails["description"]
            );
        })
        .description("Create pull request");
}
