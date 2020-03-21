import shell from "shelljs";
import { org, repo } from "../configManager/parseConfig";
export async function openLink(action, id) {
    let link;
    switch (action.toLowerCase()) {
        case "pr":
            link = `https://github.com/${org}/${repo}/pull/${id}`;
            break;
        case "issue":
            link = `https://github.com/${org}/${repo}/issues/${id}`;
    }
    shell.exec(`open ${link}`);
    shell.echo("Bye for now ;)");
}
