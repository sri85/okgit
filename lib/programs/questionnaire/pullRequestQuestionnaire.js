import inquirer from "inquirer";
import shell from "shelljs";
import { githubTemplateParser } from "../../parsers/githubTemplateParser.js";

export default function prCreator() {
    return inquirer
        .prompt([
            {
                type: "input",
                name: "remote_branch",
                message: "Which branch do you want to merge your changes into?",
            },
            {
                type: "list",
                name: "current_branch",
                message: "Current Branch",
                choices: [
                    `${shell
                        .exec("git rev-parse --abbrev-ref HEAD")
                        .toString()
                        .replace(/\n/g, "")}`,
                ],
            },
            {
                type: "input",
                name: "title",
                message: "Please enter the title for Pull Request",
            },

            {
                type: "editor",
                name: "description",
                message: "Please add the description to your PR?",
                default: githubTemplateParser("pullRequest"),
            },
        ])
        .then(answers => {
            return answers;
        });
}
