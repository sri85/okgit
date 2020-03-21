import { GITHUB_REPOS_API } from "../constants.js";

export default function createAPIBaseURL(org) {
    if (org !== undefined) return `${GITHUB_REPOS_API}/${org}`;
}
