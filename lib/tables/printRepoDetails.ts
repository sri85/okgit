import { GithubRepoAPI } from "../api/services/github/GitHubAPI";
import printTable from "./utils/printTable";
import createTable from "./utils/createTable";
import { REPO_DETAILS_HEADER } from "./utils/pullRequestTableHeaders";
import { DataTable, GithubRepoCreateData, RepoDetailsAction } from "../types";

export async function printRepoDetailsTable(
    action: RepoDetailsAction,
    repoName: string | undefined,
    repoData: GithubRepoCreateData | undefined
): Promise<void> {
    let results: DataTable = [];
    switch (action.toLowerCase()) {
        case "list":
            results =
                repoName === undefined
                    ? []
                    : await GithubRepoAPI.getRepoDetails(repoName);
            break;
        case "create":
            results =
                repoData === undefined
                    ? []
                    : await GithubRepoAPI.createRepo(repoData);
    }
    const resultsTable = createTable(REPO_DETAILS_HEADER);
    for (const result of results) {
        resultsTable.push(result.map(String));
    }
    printTable(resultsTable);
}
