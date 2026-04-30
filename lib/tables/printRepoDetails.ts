import { REPO_DETAILS_HEADER } from "./utils/pullRequestTableHeaders";
import { GithubRepoCreateData, RepoDetailsAction } from "../types";
import {
    createRepo,
    getRepoDetails,
} from "../application/usecases/repositories";
import { RepositoryDetails } from "../providers/contracts";
import { repositoryDetailsToRow } from "./mappers/repositories";
import { renderTable } from "./utils/renderTable";

export async function printRepoDetailsTable(
    action: RepoDetailsAction,
    repoName: string | undefined,
    repoData: GithubRepoCreateData | undefined
): Promise<void> {
    let results: RepositoryDetails[] = [];
    switch (action.toLowerCase()) {
        case "list":
            if (repoName !== undefined) {
                const repoDetails = await getRepoDetails(repoName);
                results = repoDetails === undefined ? [] : [repoDetails];
            }
            break;
        case "create":
            if (repoData !== undefined) {
                const repoDetails = await createRepo(repoData);
                results = repoDetails === undefined ? [] : [repoDetails];
            }
    }
    renderTable(REPO_DETAILS_HEADER, results, repositoryDetailsToRow);
}
