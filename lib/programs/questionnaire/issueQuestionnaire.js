import inquirer from "inquirer";

export default function issueCreator() {
    return inquirer
        .prompt([
            {
                type: "input",
                name: "issue_title",
                message: "Please enter the issue title?",
            },
            {
                type: "input",
                name: "issue_body",
                message: "Please enter the issue body?",
            },
        ])
        .then(answers => {
            return answers;
        });
}
