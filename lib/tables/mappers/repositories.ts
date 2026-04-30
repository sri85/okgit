import { RepositoryDetails } from "../../providers/contracts";
import { DataRow } from "../../types";

export function repositoryDetailsToRow(repo: RepositoryDetails): DataRow {
    return [
        repo.fullName,
        repo.url,
        repo.sshUrl,
        repo.forks,
        repo.openIssues,
        repo.stars,
        repo.subscribers,
    ];
}
