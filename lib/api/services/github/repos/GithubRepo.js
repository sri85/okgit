import { BaseAPI } from "../../../BaseAPI";
import validateSchema from "../../../commons/validateSchema";
import { listUserRepositoriesSchema } from "../../../commons/schemas/repositoriesSchema/listUserRepositoriesSchema";
import { org } from "../../../../configManager/parseConfig";

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
            console.error(`Unable to list repositories ${err}`);
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
            console.error(`Unable to create repo ${err}`);
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
                console.error(`Error while starring the repo ${err}`);
            });
        } else if (action === "unstar") {
            response = await this.deleteRequest(starUrl).catch(err => {
                console.error(`Error while unstarring the repo ${err}`);
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
                console.error(
                    `Error in enabling vulnerability for ${repoName} ${err}`
                );
            });
        }

        return response;
    }
}
