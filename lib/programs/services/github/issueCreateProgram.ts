#!/usr/bin/env node
import program from "commander";
import issueCreator from "../../questionnaire/issueQuestionnaire";
import { createIssue as createIssueUseCase } from "../../../application/usecases/issues";

export default function createIssue() {
    program
        .command("create-issue")
        .action(async function() {
            const issueDetails = await issueCreator();
            console.log(
                await createIssueUseCase(
                    issueDetails["issue_title"],
                    issueDetails["issue_body"]
                )
            );
        })
        .description("Create an issue from repository");
}
