import { GithubIssueResponse } from "../../../types";
import { IssueDetails } from "../../contracts";

export function mapGithubIssue(response: GithubIssueResponse): IssueDetails {
    return {
        url: response.html_url,
        author: response.user.login,
        state: response.state,
    };
}
