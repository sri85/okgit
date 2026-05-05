import { OkgitConfig } from "../types";
import { getConfigToken } from "../configManager/tokenConfig";

export type AuthHeaders = Record<string, string>;

export function createGitHubAuthHeaders(token: string): AuthHeaders {
    return { Authorization: `token ${token}` };
}

export function createGitHubAuthHeadersFromConfig(
    config: OkgitConfig
): AuthHeaders {
    return createGitHubAuthHeaders(getConfigToken(config));
}

export function createGitLabAuthHeaders(token: string): AuthHeaders {
    return { "PRIVATE-TOKEN": token };
}

export function createGitLabAuthHeadersFromConfig(
    config: OkgitConfig
): AuthHeaders {
    return createGitLabAuthHeaders(getConfigToken(config));
}
