import inquirer from "inquirer";

export default function createRepository() {
    return inquirer
        .prompt([
            {
                type: "input",
                name: "repo_title",
                message: "Please enter the name of the repo?",
            },
            {
                type: "input",
                name: "repo_description",
                message: "Please enter a description for the repo?",
            },
            {
                type: "list",
                name: "is_private",
                choices: ["yes", "no"],
                message: "Do you want this repo to be private?",
            },
            {
                type: "list",
                name: "repo_has_projects",
                choices: ["yes", "no"],
                message: "Do you want to enable project for this repo?",
            },
            {
                type: "list",
                name: "repo_has_issues",
                choices: ["yes", "no"],
                message: "Do you want to enable github issues?",
            },
            {
                type: "list",
                name: "repo_auto_init",
                choices: ["yes", "no"],
                message: "Do you want to have a readme for this repo?",
            },
        ])
        .then(answers => {
            return answers;
        });
}
