import { GITHUB_REPOS_API, GITLAB_PROJECTS_API } from "../constants.js";

export default function createAPIBaseURL(org, hosting_provider) {
    if (org !== undefined && hosting_provider !== undefined) {
        switch (hosting_provider.toLowerCase()) {
            case "github":
                return `${GITHUB_REPOS_API}/${org}`;
            case "gitlab":
                return `${GITLAB_PROJECTS_API}`;
        }
    }
}
