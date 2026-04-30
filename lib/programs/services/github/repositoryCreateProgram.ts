#!/usr/bin/env node
import program from "commander";
import createRepoQuestionnaire from "../../questionnaire/createRepoQuestionnaire";
import { printRepoDetailsTable } from "../../../tables/printRepoDetails";

export default function repoCreateProgram() {
    program
        .command("create-repo")
        .alias("m")
        .description("Create Repo")
        .action(async function() {
            const createRepo = await createRepoQuestionnaire();
            const repoData = {
                name: createRepo["repo_title"],
                description: createRepo["repo_description"],
                private: createRepo["is_private"] === "yes" ? "true" : "false",
                has_issues:
                    createRepo["repo_has_issues"] === "yes" ? "true" : "false",
                has_projects:
                    createRepo["repo_has_projects"] === "yes"
                        ? "true"
                        : "false",
                has_wiki:
                    createRepo["repo_has_wiki"] === "yes" ? "true" : "false",
                auto_init:
                    createRepo["repo_auto_init"] === "yes" ? "true" : "false",
            };
            await printRepoDetailsTable("create", undefined, repoData);
        });
}
