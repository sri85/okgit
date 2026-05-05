import { ConfigStore, FileConfigStore } from "../config/ConfigStore";
import { OpenLinkAction } from "../types";
import { execFileAsync, ExecFileRunner } from "../utils/execFile";
import {
    assertGitHubOwner,
    assertRepositoryName,
    parsePositiveIntegerId,
} from "../utils/validators";

export function buildGitHubWebUrl(
    owner: string,
    repoName: string,
    action: OpenLinkAction,
    id: number | string = ""
): string {
    assertGitHubOwner(owner);
    assertRepositoryName(repoName);

    const url = new URL(`https://github.com/${owner}/${repoName}`);
    switch (action.toLowerCase()) {
        case "pr":
            url.pathname = `${url.pathname}/pull/${parsePositiveIntegerId(id)}`;
            break;
        case "issue":
            url.pathname = `${url.pathname}/issues/${parsePositiveIntegerId(
                id
            )}`;
            break;
        case "repo":
            break;
    }
    return url.toString();
}

export function createOpenCommand(url: string): {
    command: string;
    args: string[];
} {
    if (process.platform === "darwin") {
        return { command: "open", args: [url] };
    }
    if (process.platform === "win32") {
        return { command: "cmd", args: ["/c", "start", "", url] };
    }
    return { command: "xdg-open", args: [url] };
}

export async function openLink(
    action: OpenLinkAction,
    id: number | string = "",
    runner: ExecFileRunner = execFileAsync,
    configStore: ConfigStore = new FileConfigStore()
): Promise<void> {
    const config = configStore.readConfig();
    const link = buildGitHubWebUrl(
        config.organization_username,
        config.repo,
        action,
        id
    );
    const openCommand = createOpenCommand(link);
    await runner(openCommand.command, openCommand.args);
    console.log("Bye for now 😉");
}
