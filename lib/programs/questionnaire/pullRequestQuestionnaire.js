import inquirer from "inquirer";

export default function prCreator() {
    return inquirer
        .prompt([
            {
                type: "input",
                name: "remote_branch",
                message: "Which branch do you want to merge your changes into?",
            },
            {
                type: "input",
                name: "title",
                message: "What is PR title?",
            },
            {
                type: "input",
                name: "current_branch",
                message:
                    "Paste the current branch, its already in your clipboard",
            },
        ])
        .then(answers => {
            return answers;
        });
}
