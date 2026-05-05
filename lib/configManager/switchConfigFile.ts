import fs from "fs";
import { OkgitConfig } from "../types";
import { assertGitHubOwner, assertRepositoryName } from "../utils/validators";

export interface RepoReference {
    owner: string;
    repo: string;
}

export function parseRepoReference(reference: string): RepoReference {
    const parts = reference.trim().split("/");
    if (parts.length !== 2) {
        throw new Error(
            "Expected repository reference in the format owner/repo"
        );
    }
    const [owner, repo] = parts;
    if (owner === undefined || repo === undefined || owner === "" || repo === "") {
        throw new Error(
            "Expected repository reference in the format owner/repo"
        );
    }
    assertGitHubOwner(owner);
    assertRepositoryName(repo);
    return { owner, repo };
}

export function switchConfig(config: OkgitConfig, reference: string): OkgitConfig {
    const parsedReference = parseRepoReference(reference);
    return {
        ...config,
        organization_username: parsedReference.owner,
        repo: parsedReference.repo,
    };
}

export function switchConfigFile(
    configFilePath: string,
    reference: string
): OkgitConfig {
    const data = fs.readFileSync(configFilePath, "utf-8");
    const config = JSON.parse(data) as OkgitConfig;
    const updatedConfig = switchConfig(config, reference);
    fs.writeFileSync(configFilePath, `${JSON.stringify(updatedConfig, null, 2)}\n`, {
        mode: 0o600,
    });
    return updatedConfig;
}
