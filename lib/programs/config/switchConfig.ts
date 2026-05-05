#!/usr/bin/env node
import program from "commander";

import switchConfigQuestionnaire from "../questionnaire/switchConfigQuestionnaire";
import { switchConfig } from "../../configManager/switchConfigFile";
import { FileConfigStore } from "../../config/ConfigStore";

export default function switchRepoConfig() {
    program
        .command("switchrepo")
        .action(async function() {
            const conf = await switchConfigQuestionnaire();
            const configJson = new FileConfigStore().updateConfig(config =>
                switchConfig(config, conf["organization_username"])
            );
            console.log(
                `Switched successfully to ${configJson.organization_username}/${configJson.repo}`
            );
        })
        .description("switch the cli to a different repo");
}
