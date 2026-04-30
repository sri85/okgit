#!/usr/bin/env node
import program from "commander";
import prCreator from "../../questionnaire/pullRequestQuestionnaire";
import { createPullRequest as createPullRequestUseCase } from "../../../application/usecases/pullRequests";

async function createPullRequestAction() {
    const prDetails = await prCreator();
    await createPullRequestUseCase(
        prDetails["title"],
        prDetails["current_branch"],
        prDetails["remote_branch"],
        prDetails["description"]
    );
}

export default function createPullRequest() {
    program
        .command("createPR")
        .action(async function() {
            await createPullRequestAction();
        })
        .description("Create pull request");

    program
        .command("create-pr")
        .action(async function() {
            await createPullRequestAction();
        })
        .description("Create pull request");
}
