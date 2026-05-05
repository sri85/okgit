export function assertGitHubOwner(owner: string): void {
    if (!/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/.test(owner)) {
        throw new Error(`Invalid GitHub owner: ${owner}`);
    }
}

export function assertRepositoryName(repoName: string): void {
    if (!/^[A-Za-z0-9._-]+$/.test(repoName)) {
        throw new Error(`Invalid repository name: ${repoName}`);
    }
}

export function parsePositiveIntegerId(id: number | string): string {
    const normalizedId = String(id);
    if (!/^[1-9][0-9]*$/.test(normalizedId)) {
        throw new Error(`Expected a positive integer id, got: ${normalizedId}`);
    }
    return normalizedId;
}
