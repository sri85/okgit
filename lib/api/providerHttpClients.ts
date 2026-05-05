import { BaseAPI } from "./BaseAPI";
import {
    createGitHubAuthHeadersFromConfig,
    createGitLabAuthHeadersFromConfig,
} from "./authHeaders";
import { HttpClient } from "./httpClient";
import { OkgitConfig } from "../types";
import createAPIBaseURL from "../utils/helpers";

export function createGitHubHttpClient(config: OkgitConfig): HttpClient {
    return new BaseAPI(
        createAPIBaseURL(config.organization_username, "github") ?? "",
        5000,
        createGitHubAuthHeadersFromConfig(config)
    );
}

export function createGitLabHttpClient(config: OkgitConfig): HttpClient {
    return new BaseAPI(
        createAPIBaseURL(
            config.organization_username,
            config.hosting_provider_choice
        ) ?? "",
        5000,
        createGitLabAuthHeadersFromConfig(config)
    );
}
