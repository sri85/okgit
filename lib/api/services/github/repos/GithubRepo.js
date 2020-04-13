import { BaseAPI } from "../../../BaseAPI";
import validateSchema from "../../../commons/validateSchema";
import { listUserRepositoriesSchema } from "../../../commons/schemas/repositoriesSchema/listUserRepositoriesSchema";
import { org } from "../../../../configManager/parseConfig";
import errorHandler from "../../../../tables/utils/errorHandler";

export class GithubRepo extends BaseAPI {
    constructor(baseURL, timeout) {
        super(baseURL, timeout);
        this.userUrl = "https://api.github.com/user";
    }

    async getRepoDetails(repoName) {
        const userRepoUrl = `/${repoName}`;
        let results = [];
        const listRepositoriesResponse = await this.getRequest(
            userRepoUrl
        ).catch(err => {
            errorHandler(err["status"], "listRepositories", repoName);
            return results;
        });
        if (
            validateSchema(
                listRepositoriesResponse,
                listUserRepositoriesSchema()
            )
        ) {
            results.push([
                listRepositoriesResponse["full_name"],
                listRepositoriesResponse["html_url"],
                listRepositoriesResponse["ssh_url"],
                listRepositoriesResponse["forks"],
                listRepositoriesResponse["open_issues"],
                listRepositoriesResponse["stargazers_count"],
                listRepositoriesResponse["subscribers_count"],
            ]);
        }
        return results;
    }

    async createRepo(repoData) {
        const createRepoURL = `${this.userUrl}/repos`;
        let results = [];
        const createRepositoryResponse = await this.postRequest(
            createRepoURL,
            repoData
        ).catch(err => {
            errorHandler(err["status"], "createRepository", "name");
            return results;
        });
        if (
            validateSchema(
                createRepositoryResponse,
                listUserRepositoriesSchema()
            )
        ) {
            results.push([
                createRepositoryResponse["full_name"],
                createRepositoryResponse["html_url"],
                createRepositoryResponse["ssh_url"],
                createRepositoryResponse["forks"],
                createRepositoryResponse["open_issues"],
                createRepositoryResponse["stargazers_count"],
                createRepositoryResponse["subscribers_count"],
            ]);
        }
        return results;
    }

    async toggleStarUnstarRepo(repoName, action) {
        const starUrl = `${this.userUrl}/starred/${org}/${repoName}`;
        let response;
        if (action === "star") {
            response = await this.putRequest(starUrl).catch(err => {
                errorHandler(err["status"], "star-repo", repoName);
            });
        } else if (action === "unstar") {
            response = await this.deleteRequest(starUrl).catch(err => {
                errorHandler(err["status"], "unstar-repo", repoName);
            });
        }

        return response.status;
    }

    async enableVulnerabilityScan(action, repoName) {
        const vulnerabilityUrl = `/${repoName}/vulnerability-alerts`;
        let response;
        if (action === "enable") {
            response = await this.putRequest(vulnerabilityUrl, undefined, {
                Accept: "application/vnd.github.dorian-preview+json",
            }).catch(err => {
                errorHandler(
                    err["status"],
                    "enable-vulernability-scan",
                    repoName
                );
            });
        }

        return response;
    }
}
