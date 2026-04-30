import { BaseAPI } from "../../../BaseAPI";
import validateSchema from "../../../commons/validateSchema";
import { listUserRepositoriesSchema } from "../../../commons/schemas/repositoriesSchema/listUserRepositoriesSchema";
import { org } from "../../../../configManager/parseConfig";
import errorHandler from "../../../../tables/utils/errorHandler";
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

    constructor(baseURL: string, timeout?: number) {
        super(baseURL, timeout);
        this.userUrl = "https://api.github.com/user";
    }

    async getRepositoryDetails(
        repoName: string
    ): Promise<RepositoryDetails | undefined> {
        const userRepoUrl = `/${repoName}`;
        const listRepositoriesResponse = await this.getRequest<unknown>(
            userRepoUrl
        ).catch((err: unknown) => {
            errorHandler(this.getStatusCode(err), "listRepositories", repoName);
            return undefined;
        });
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
        const createRepositoryResponse = await this.postRequest<unknown>(
            createRepoURL,
            repoData
        ).catch((err: unknown) => {
            errorHandler(this.getStatusCode(err), "createRepository", "name");
            return undefined;
        });
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
        const starUrl = `${this.userUrl}/starred/${org}/${repoName}`;
        let response: AxiosResponse<unknown> | undefined;
        if (action === "star") {
            response = await this.putRequest<unknown>(starUrl).catch(
                (err: unknown) => {
                    errorHandler(
                        this.getStatusCode(err),
                        "star-repo",
                        repoName
                    );
                    return undefined;
                }
            );
        } else {
            await this.deleteRequest<unknown>(starUrl).catch((err: unknown) => {
                errorHandler(this.getStatusCode(err), "unstar-repo", repoName);
                return undefined;
            });
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
            response = await this.putRequest<unknown>(
                vulnerabilityUrl,
                undefined,
                {
                    Accept: "application/vnd.github.dorian-preview+json",
                }
            ).catch((err: unknown) => {
                errorHandler(
                    this.getStatusCode(err),
                    "enable-vulernability-scan",
                    repoName
                );
                return undefined;
            });
        }

        return response;
    }

}
