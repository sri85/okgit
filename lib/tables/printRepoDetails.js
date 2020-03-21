import { GithubRepoAPI } from "../api/services/github/GitHubAPI";
import printTable from "./utils/printTable";
import createTable from "./utils/createTable";
import { REPO_DETAILS_HEADER } from "./utils/pullRequestTableHeaders";
export async function printRepoDetailsTable(action, repoName, repoData) {
    let results;
    switch (action.toLowerCase()) {
        case "list":
            results = await GithubRepoAPI.getRepoDetails(repoName);
            break;
        case "create":
            results = await GithubRepoAPI.createRepo(repoData);
    }
    const resultsTable = createTable(REPO_DETAILS_HEADER);
    for (let i = 0; i < results.length; i++) {
        resultsTable.push(results[i]);
    }
    printTable(resultsTable);
}
