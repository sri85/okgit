import { OkgitConfig } from "../types";

const REDACTED_TOKEN = "<redacted>";

export function getConfigToken(config: OkgitConfig): string {
    return config.personal_access_token ?? config.personnel_access_token;
}

export function normalizeTokenConfig(config: OkgitConfig): OkgitConfig {
    const token = getConfigToken(config);
    return {
        ...config,
        personal_access_token: token,
        personnel_access_token: token,
    };
}

export function redactConfig(config: OkgitConfig): OkgitConfig {
    return {
        ...config,
        personal_access_token:
            config.personal_access_token === undefined
                ? undefined
                : REDACTED_TOKEN,
        personnel_access_token: REDACTED_TOKEN,
    };
}
