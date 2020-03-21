import inquirer from "inquirer";

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
        ])
        .then(answers => {
            return answers;
        });
}
