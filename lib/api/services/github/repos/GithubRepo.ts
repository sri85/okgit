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

export class GithubRepo extends BaseAPI {
    private readonly userUrl: string;

    constructor(baseURL: string, timeout?: number) {
        super(baseURL, timeout);
        this.userUrl = "https://api.github.com/user";
    }

    async getRepoDetails(repoName: string): Promise<DataTable> {
        const userRepoUrl = `/${repoName}`;
        const results: DataTable = [];
        const listRepositoriesResponse = await this.getRequest<unknown>(
            userRepoUrl
        ).catch((err: unknown) => {
            errorHandler(this.getStatusCode(err), "listRepositories", repoName);
            return results;
        });
        if (
            validateSchema<GithubRepoResponse>(
                listRepositoriesResponse,
                listUserRepositoriesSchema()
            )
        ) {
            results.push([
                listRepositoriesResponse.full_name,
                listRepositoriesResponse.html_url,
                listRepositoriesResponse.ssh_url,
                listRepositoriesResponse.forks,
                listRepositoriesResponse.open_issues,
                listRepositoriesResponse.stargazers_count,
                listRepositoriesResponse.subscribers_count,
            ]);
        }
        return results;
    }

    async createRepo(repoData: GithubRepoCreateData): Promise<DataTable> {
        const createRepoURL = `${this.userUrl}/repos`;
        const results: DataTable = [];
        const createRepositoryResponse = await this.postRequest<unknown>(
            createRepoURL,
            repoData
        ).catch((err: unknown) => {
            errorHandler(this.getStatusCode(err), "createRepository", "name");
            return results;
        });
        if (
            validateSchema<GithubRepoResponse>(
                createRepositoryResponse,
                listUserRepositoriesSchema()
            )
        ) {
            results.push([
                createRepositoryResponse.full_name,
                createRepositoryResponse.html_url,
                createRepositoryResponse.ssh_url,
                createRepositoryResponse.forks,
                createRepositoryResponse.open_issues,
                createRepositoryResponse.stargazers_count,
                createRepositoryResponse.subscribers_count,
            ]);
        }
        return results;
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
