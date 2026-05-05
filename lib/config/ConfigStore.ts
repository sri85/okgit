import fs from "fs";
import os from "os";
import path from "path";
import { OkgitConfig, HostingProvider } from "../types";
import { assertGitHubOwner, assertRepositoryName } from "../utils/validators";
import { getConfigToken, normalizeTokenConfig } from "../configManager/tokenConfig";

const CONFIG_DIR_NAME = ".git-cli";
const CONFIG_FILE_NAME = "config.json";

const SUPPORTED_PROVIDERS: HostingProvider[] = [
    "",
    "Github",
    "Gitlab",
    "Bitbucket",
    "github",
    "gitlab",
    "bitbucket",
];

export class ConfigReadError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ConfigReadError";
    }
}

export class ConfigValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ConfigValidationError";
    }
}

export interface ConfigStore {
    readConfig(): OkgitConfig;
    writeConfig(config: OkgitConfig): void;
    updateConfig(mutator: (config: OkgitConfig) => OkgitConfig): OkgitConfig;
}

export function getDefaultConfig(): OkgitConfig {
    return {
        repo: "",
        organization_username: "",
        personnel_access_token: "",
        personal_access_token: "",
        hosting_provider_choice: "",
    };
}

export function resolveDefaultConfigPath(homeDir = os.homedir()): string {
    return path.join(homeDir, CONFIG_DIR_NAME, CONFIG_FILE_NAME);
}

export function validateConfig(config: OkgitConfig): void {
    if (!SUPPORTED_PROVIDERS.includes(config.hosting_provider_choice ?? "")) {
        throw new ConfigValidationError(
            `Unsupported hosting provider: ${config.hosting_provider_choice}`
        );
    }

    if (config.organization_username !== "") {
        try {
            assertGitHubOwner(config.organization_username);
        } catch (err) {
            throw new ConfigValidationError((err as Error).message);
        }
    }

    if (config.repo !== "") {
        try {
            assertRepositoryName(config.repo);
        } catch (err) {
            throw new ConfigValidationError((err as Error).message);
        }
    }
}

export function requireConfigToken(config: OkgitConfig): string {
    const token = getConfigToken(config);
    if (token === "") {
        throw new ConfigValidationError("Missing personal access token");
    }
    return token;
}

export class FileConfigStore implements ConfigStore {
    constructor(private readonly configFilePath = resolveDefaultConfigPath()) {}

    readConfig(): OkgitConfig {
        if (!fs.existsSync(this.configFilePath)) {
            return getDefaultConfig();
        }

        try {
            const rawConfig = fs.readFileSync(this.configFilePath, "utf8");
            const config = normalizeTokenConfig(JSON.parse(rawConfig) as OkgitConfig);
            validateConfig(config);
            return config;
        } catch (err) {
            if (err instanceof ConfigValidationError) {
                throw err;
            }
            throw new ConfigReadError(
                `Unable to read config from ${this.configFilePath}`
            );
        }
    }

    writeConfig(config: OkgitConfig): void {
        const normalizedConfig = normalizeTokenConfig(config);
        validateConfig(normalizedConfig);

        const configDir = path.dirname(this.configFilePath);
        fs.mkdirSync(configDir, { recursive: true, mode: 0o700 });
        fs.chmodSync(configDir, 0o700);
        fs.writeFileSync(
            this.configFilePath,
            `${JSON.stringify(normalizedConfig, null, 2)}\n`,
            { mode: 0o600 }
        );
    }

    updateConfig(mutator: (config: OkgitConfig) => OkgitConfig): OkgitConfig {
        const updatedConfig = mutator(this.readConfig());
        this.writeConfig(updatedConfig);
        return updatedConfig;
    }
}
