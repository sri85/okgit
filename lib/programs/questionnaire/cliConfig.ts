import inquirer from "inquirer";
import clc from "cli-color";

export default function cliConfig() {
    return inquirer
        .prompt([
            {
                type: "list",
                name: "hosting_provider_choice",
                message: "Who's your git hosting provider?",
                choices: ["Github", "Gitlab", "Bitbucket"],
            },
            {
                type: "password",
                name: "personnel_access_token",
                message: "Please enter your access token",
            },
            {
                type: "string",
                name: "organization_username",
                message: "Please enter your github organization or username",
            },
            {
                type: "string",
                name: "repo",
                message:
                    "Please enter the name of the repo you want to configure this to?",
            },
            {
                type: "editor",
                name: "pullRequestTemplate",
                message: `${clc.yellow(
                    "Please paste the contents of your pull request template' +\n " +
                        "' you can find it under .github folder of the repository (if there is one), else leave it blank"
                )}`,
            },
            {
                type: "editor",
                name: "issueTemplate",
                message: `${clc.yellow(
                    "Please paste the contents of your issue template' +\n " +
                        "' you can find it under .github folder of the repository (if there is one), else leave it blank"
                )}`,
            },
        ])
        .then(answers => {
            return answers;
        });
}
