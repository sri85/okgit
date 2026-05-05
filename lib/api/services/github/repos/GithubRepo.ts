import { BaseAPI } from "../../../BaseAPI";
import { HttpClient } from "../../../httpClient";
import { withLegacyProviderErrorHandling } from "../../../providerErrors";
import validateSchema from "../../../commons/validateSchema";
import { listUserRepositoriesSchema } from "../../../commons/schemas/repositoriesSchema/listUserRepositoriesSchema";
import { org as configuredOrg } from "../../../../configManager/parseConfig";
import { createGitHubAuthHeaders } from "../../../authHeaders";
import {
    DataTable,
    GithubRepoCreateData,
    GithubRepoResponse,
    RepoUpdateAction,
} from "../../../../types";
import { AxiosResponse } from "axios";
import {
    RepositoryDetails,
    RepositoryProvider,
} from "../../../../providers/contracts";
import { mapGithubRepositoryDetails } from "../../../../providers/github/mappers/repositories";
import { repositoryDetailsToRow } from "../../../../tables/mappers/repositories";

export class GithubRepo extends BaseAPI implements RepositoryProvider {
    private readonly userUrl: string;
    private readonly client: HttpClient;

    constructor(
        baseURL: string,
        timeout?: number,
        private readonly orgName = configuredOrg,
        token?: string,
        client?: HttpClient
    ) {
        super(
            baseURL,
            timeout,
            token === undefined ? undefined : createGitHubAuthHeaders(token)
        );
        this.client = client ?? this;
        this.userUrl = "https://api.github.com/user";
    }

    static fromHttpClient(orgName: string, client: HttpClient): GithubRepo {
        return new GithubRepo("", undefined, orgName, undefined, client);
    }

    async getRepositoryDetails(
        repoName: string
    ): Promise<RepositoryDetails | undefined> {
        const userRepoUrl = `/${repoName}`;
        const listRepositoriesResponse = await withLegacyProviderErrorHandling(
            this.client.get<unknown>(userRepoUrl),
            { action: "listRepositories", resource: repoName },
            undefined
        );
        if (listRepositoriesResponse === undefined) {
            return undefined;
        }
        if (
            validateSchema<GithubRepoResponse>(
                listRepositoriesResponse,
                listUserRepositoriesSchema()
            )
        ) {
            return mapGithubRepositoryDetails(listRepositoriesResponse);
        }
        return undefined;
    }

    async getRepoDetails(repoName: string): Promise<DataTable> {
        const repoDetails = await this.getRepositoryDetails(repoName);
        if (repoDetails === undefined) {
            return [];
        }
        return [repositoryDetailsToRow(repoDetails)];
    }

    async createRepository(
        repoData: GithubRepoCreateData
    ): Promise<RepositoryDetails | undefined> {
        const createRepoURL = `${this.userUrl}/repos`;
        const createRepositoryResponse = await withLegacyProviderErrorHandling(
            this.client.post<unknown>(createRepoURL, repoData),
            { action: "createRepository", resource: "name" },
            undefined
        );
        if (createRepositoryResponse === undefined) {
            return undefined;
        }
        if (
            validateSchema<GithubRepoResponse>(
                createRepositoryResponse,
                listUserRepositoriesSchema()
            )
        ) {
            return mapGithubRepositoryDetails(createRepositoryResponse);
        }
        return undefined;
    }

    async createRepo(repoData: GithubRepoCreateData): Promise<DataTable> {
        const repoDetails = await this.createRepository(repoData);
        if (repoDetails === undefined) {
            return [];
        }
        return [repositoryDetailsToRow(repoDetails)];
    }

    async toggleStarUnstarRepo(
        repoName: string,
        action: Exclude<RepoUpdateAction, "enable">
    ): Promise<number | undefined> {
        const starUrl = `${this.userUrl}/starred/${this.orgName}/${repoName}`;
        let response: AxiosResponse<unknown> | undefined;
        if (action === "star") {
            response = await withLegacyProviderErrorHandling(
                this.client.put<unknown>(starUrl),
                { action: "star-repo", resource: repoName },
                undefined
            );
        } else {
            await withLegacyProviderErrorHandling(
                this.client.delete<unknown>(starUrl),
                { action: "unstar-repo", resource: repoName },
                undefined
            );
        }

        return response === undefined ? undefined : response.status;
    }

    async enableVulnerabilityScan(
        action: Extract<RepoUpdateAction, "enable">,
        repoName: string
    ): Promise<AxiosResponse<unknown> | undefined> {
        const vulnerabilityUrl = `/${repoName}/vulnerability-alerts`;
        let response: AxiosResponse<unknown> | undefined;
        if (action === "enable") {
            response = await withLegacyProviderErrorHandling(
                this.client.put<unknown>(vulnerabilityUrl, undefined, {
                    Accept: "application/vnd.github.dorian-preview+json",
                }),
                { action: "enable-vulernability-scan", resource: repoName },
                undefined
            );
        }

        return response;
    }

}
