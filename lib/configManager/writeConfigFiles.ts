import fs from "fs";
import path from "path";
import { OkgitConfig } from "../types";
import { assertRepositoryName } from "../utils/validators";
import { normalizeTokenConfig } from "./tokenConfig";

export interface WrittenConfigPaths {
    configFilePath: string;
    issueTemplateFilePath: string;
    pullRequestTemplateFilePath: string;
}

export function createConfigFilePaths(
    configDir: string,
    repoName: string
): WrittenConfigPaths {
    assertRepositoryName(repoName);
    return {
        configFilePath: path.join(configDir, "config.json"),
        issueTemplateFilePath: path.join(
            configDir,
            `${repoName}-issue-template.md`
        ),
        pullRequestTemplateFilePath: path.join(
            configDir,
            `${repoName}-pr-template.md`
        ),
    };
}

export function writeConfigFiles(
    configDir: string,
    config: OkgitConfig
): WrittenConfigPaths {
    const normalizedConfig = normalizeTokenConfig(config);
    const paths = createConfigFilePaths(configDir, normalizedConfig.repo);
    fs.mkdirSync(configDir, { recursive: true, mode: 0o700 });
    fs.chmodSync(configDir, 0o700);
    fs.writeFileSync(
        paths.configFilePath,
        `${JSON.stringify(normalizedConfig, null, 2)}\n`,
        {
            mode: 0o600,
        }
    );

    if (
        normalizedConfig.pullRequestTemplate !== undefined &&
        normalizedConfig.pullRequestTemplate !== ""
    ) {
        fs.writeFileSync(
            paths.pullRequestTemplateFilePath,
            normalizedConfig.pullRequestTemplate,
            {
                mode: 0o600,
            }
        );
    }
    if (
        normalizedConfig.issueTemplate !== undefined &&
        normalizedConfig.issueTemplate !== ""
    ) {
        fs.writeFileSync(
            paths.issueTemplateFilePath,
            normalizedConfig.issueTemplate,
            {
                mode: 0o600,
            }
        );
    }

    return paths;
}
