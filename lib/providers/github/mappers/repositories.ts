import { GithubRepoResponse } from "../../../types";
import { RepositoryDetails } from "../../contracts";

export function mapGithubRepositoryDetails(
    response: GithubRepoResponse
): RepositoryDetails {
    return {
        fullName: response.full_name,
        url: response.html_url,
        sshUrl: response.ssh_url,
        forks: response.forks,
        openIssues: response.open_issues,
        stars: response.stargazers_count,
        subscribers: response.subscribers_count,
    };
}
