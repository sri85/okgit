import { okgitProvider } from "../../providers";
import { OkgitProvider, RepositoryDetails } from "../../providers/contracts";
import { GithubRepoCreateData, RepoUpdateAction } from "../../types";

export function createRepositoryUseCases(provider: OkgitProvider) {
    return {
        getRepoDetails(
            repoName: string
        ): Promise<RepositoryDetails | undefined> {
            return provider.repositories.getRepositoryDetails(repoName);
        },

        createRepo(
            repoData: GithubRepoCreateData
        ): Promise<RepositoryDetails | undefined> {
            return provider.repositories.createRepository(repoData);
        },

        async updateRepository(
            action: RepoUpdateAction,
            repoName: string
        ): Promise<void> {
            switch (action.toLowerCase()) {
                case "star":
                    await provider.repositories.toggleStarUnstarRepo(
                        repoName,
                        "star"
                    );
                    console.log(`Starred ${repoName} successfully`);
                    break;
                case "unstar":
                    await provider.repositories.toggleStarUnstarRepo(
                        repoName,
                        "unstar"
                    );
                    console.log(`Unstarred ${repoName} successfully`);
                    break;
                case "enable":
                    await provider.repositories.enableVulnerabilityScan(
                        "enable",
                        repoName
                    );
                    console.log(
                        `Enabled vulnerability scan for ${repoName} successfully`
                    );
                    break;
            }
        },
    };
}

const repositoryUseCases = createRepositoryUseCases(okgitProvider);

export const getRepoDetails = repositoryUseCases.getRepoDetails;
export const createRepo = repositoryUseCases.createRepo;
export const updateRepository = repositoryUseCases.updateRepository;
