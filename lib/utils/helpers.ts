import { GITHUB_REPOS_API, GITLAB_PROJECTS_API } from "../constants";

export default function createAPIBaseURL(
    org: string | undefined,
    hosting_provider: string | undefined
): string | undefined {
    if (org !== undefined && hosting_provider !== undefined) {
        switch (hosting_provider.toLowerCase()) {
            case "github":
                return `${GITHUB_REPOS_API}/${org}`;
            case "gitlab":
                return `${GITLAB_PROJECTS_API}`;
        }
    }
    return undefined;
}
