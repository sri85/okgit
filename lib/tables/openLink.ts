import shell from "shelljs";
import { org, repo } from "../configManager/parseConfig";
import { OpenLinkAction } from "../types";

export async function openLink(
    action: OpenLinkAction,
    id: number | string = ""
): Promise<void> {
    let link = "";
    const GITHUB_BASE_URL = `https://github.com/${org}/${repo}`;
    switch (action.toLowerCase()) {
        case "pr":
            link = `${GITHUB_BASE_URL}/pull/${id}`;
            break;
        case "issue":
            link = `${GITHUB_BASE_URL}/issues/${id}`;
            break;
        case "repo":
            link = `${GITHUB_BASE_URL}`;
            break;
    }
    shell.exec(`open ${link}`);
    shell.echo("Bye for now 😉");
}
