#!/usr/bin/env node
import program from "commander";
import { GithubIssueAPI } from "../../../api/services/github/GitHubAPI";
import issueCreator from "../../questionnaire/issueQuestionnaire";

export default function createIssue() {
    program
        .command("create-issue")
        .action(async function() {
            const issueDetails = await issueCreator();
            console.log(
                await GithubIssueAPI.createIssue(
                    issueDetails["issue_title"],
                    issueDetails["issue_body"]
                )
            );
        })
        .description("Create an issue from repository");
}
