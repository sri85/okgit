import { hosting_provider } from "../configManager/parseConfig";
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
    providerName: string | undefined = hosting_provider
): OkgitProvider {
    const provider = normalizeProviderName(providerName);
    switch (provider) {
        case "":
        case "github":
            return createGithubProvider();
        default:
            throw new UnsupportedProviderError(provider);
    }
}

export const okgitProvider = getConfiguredProvider();
