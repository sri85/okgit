import { updateRepository } from "../application/usecases/repositories";
import { RepoUpdateAction } from "../types";

export async function printUpdateRepoTable(
    action: RepoUpdateAction,
    repoName: string
): Promise<void> {
    await updateRepository(action, repoName);
}
