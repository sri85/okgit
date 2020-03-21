import { GithubRepoAPI } from "../api/services/github/GitHubAPI";

export async function printUpdateRepoTable(action, repoName) {
    switch (action.toLowerCase()) {
        case "star":
            await GithubRepoAPI.toggleStarUnstarRepo(repoName, "star");
            console.log(`Starred ${repoName} successfully`);
            break;
        case "unstar":
            await GithubRepoAPI.toggleStarUnstarRepo(repoName, "unstar");
            console.log(`Unstarred ${repoName} successfully`);
            break;
        case "enable":
            await GithubRepoAPI.enableVulnerabilityScan("enable", repoName);
            console.log(
                `Enabled vulnerability scan for ${repoName} successfully`
            );
            break;
    }
}
