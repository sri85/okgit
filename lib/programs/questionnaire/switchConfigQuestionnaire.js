import inquirer from "inquirer";
import clc from "cli-color";

export default function switchConfigQuestionnaire() {
    return inquirer
        .prompt([
            {
                type: "string",
                name: "organization_username",
                message: `Please enter the repo that you would like to switch to? ${clc.green(
                    "eg: sri85/git-cli"
                )}`,
            },
        ])
        .then(answers => {
            return answers;
        });
}
