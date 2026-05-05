#!/usr/bin/env node
import program from "commander";
import clc from "cli-color";
import { OkgitConfig } from "../../types";
import { redactConfig } from "../../configManager/tokenConfig";
import { FileConfigStore } from "../../config/ConfigStore";

export function formatCurrentConfig(orgName: string, repoName: string): string {
    return `Currently okgit is configured to ${clc.green(
        `${orgName}/${repoName}`
    )} if you need to change use command ${clc.green("okgit switchrepo")}`;
}

export function formatRedactedConfig(config: OkgitConfig): string {
    return JSON.stringify(redactConfig(config), null, 2);
}

export default function showConfig() {
    program.command("showConfig").action(() => {
        const config = new FileConfigStore().readConfig();
        console.log(
            formatCurrentConfig(config.organization_username, config.repo)
        );
    });
}
