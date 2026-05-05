import { FileConfigStore, getDefaultConfig } from "../config/ConfigStore";
import { OkgitConfig } from "../types";
import { OkgitProvider } from "./contracts";
import { createGithubProvider } from "./github/provider";

export class UnsupportedProviderError extends Error {
    constructor(provider: string) {
        super(`Unsupported hosting provider: ${provider}`);
        this.name = "UnsupportedProviderError";
    }
}

export function normalizeProviderName(
    provider: string | undefined
): string {
    return (provider ?? "github").trim().toLowerCase();
}

export function getConfiguredProvider(
    providerName: string | undefined,
    config: OkgitConfig = getDefaultConfig()
): OkgitProvider {
    const provider = normalizeProviderName(providerName);
    switch (provider) {
        case "":
        case "github":
            return createGithubProvider(config);
        default:
            throw new UnsupportedProviderError(provider);
    }
}

export function getConfiguredProviderFromConfig(
    config: OkgitConfig
): OkgitProvider {
    return getConfiguredProvider(config.hosting_provider_choice, config);
}

export function getConfiguredProviderFromStore(
    configStore = new FileConfigStore()
): OkgitProvider {
    return getConfiguredProviderFromConfig(configStore.readConfig());
}

export const okgitProvider = getConfiguredProviderFromStore();
