import clc from "cli-color";
import moment from "moment";
import { repo } from "../../../../configManager/parseConfig";

import { BaseAPI } from "../../../BaseAPI";
import validateSchema from "../../../commons/validateSchema";
import { pullrequestListSchema } from "../../../commons/schemas/pullRequestSchema/pullrequestListSchema";
import { pullRequestCommentsSchema } from "../../../commons/schemas/pullRequestSchema/pullRequestCommentsSchema";
import { pullRequestDetailsSchema } from "../../../commons/schemas/pullRequestSchema/pullRequestDetailsSchema";
import { pullRequestCommitsSchema } from "../../../commons/schemas/pullRequestSchema/pullRequestCommitsSchema";
import { pullRequestFilesSchema } from "../../../commons/schemas/pullRequestSchema/pullRequestFilesSchema";
import { pullrequestUpdateSchema } from "../../../commons/schemas/pullRequestSchema/pullRequestUpdateStatus";
import { pullRequestAddReviewersSchema } from "../../../commons/schemas/pullRequestSchema/pullRequestAddReviewersSchema";
import errorHandler from "../../../../tables/utils/errorHandler";
import {
    DataTable,
    GithubCreatePullRequestResponse,
    GithubMergePullRequestResponse,
    GithubPullRequestCommentResponse,
    GithubPullRequestCommitResponse,
    GithubPullRequestDetailsResponse,
    GithubPullRequestFileResponse,
    GithubPullRequestListItem,
    GithubPullRequestUpdateResponse,
    GithubReviewersResponse,
} from "../../../../types";

export class GithubPullRequest extends BaseAPI {
    constructor(baseURL: string, timeout?: number) {
        super(baseURL, timeout);
    }

    async createPullRequest(
        title: string,
        currentBranchName: string,
        baseBranchName: string,
        body: string
    ): Promise<void> {
        const prData = {
            title: title,
            head: currentBranchName,
            base: baseBranchName,
            body: body,
        };
        const createRepositoryResponse = await this.postRequest<unknown>(
            `/${repo}/pulls`,
            prData
        ).catch((err: unknown) => {
            errorHandler(this.getStatusCode(err), "createPullRequest", repo);
            return undefined;
        });
        if (
            typeof createRepositoryResponse !== "object" ||
            createRepositoryResponse === null ||
            !("html_url" in createRepositoryResponse) ||
            typeof createRepositoryResponse.html_url !== "string"
        ) {
            return;
        }
        const createdPullRequest: GithubCreatePullRequestResponse = {
            html_url: createRepositoryResponse.html_url,
        };
        console.log(
            `Created Pull Request ${createdPullRequest.html_url} 🚀 ${clc.green(
                "use okgit pr <id> --web "
            )} top open in your favorite browser`
        );
        return;
    }
    async getPullRequests(
        repoName: string,
        state: string | undefined
    ): Promise<DataTable> {
        const pullRequestState = state === undefined ? "open" : state;
        const getPullRequestUrl = `/${repoName}/pulls?state=${pullRequestState}`;

        const PRDetailTable: DataTable = [];
        const response = await this.getRequest<unknown>(
            getPullRequestUrl
        ).catch((err: unknown) => {
            errorHandler(this.getStatusCode(err), "pullRequests", repo);
            return PRDetailTable;
        });

        if (
            validateSchema<GithubPullRequestListItem[]>(
                response,
                pullrequestListSchema()
            )
        ) {
            response.forEach(obj => {
                const url = obj.html_url;
                const createdDate = this.formatDate(obj.created_at);
                const user = obj.user.login;
                PRDetailTable.push([url, pullRequestState, user, createdDate]);
            });
        }
        return PRDetailTable;
    }
    async showPullRequestComments(id: number | string): Promise<DataTable> {
        const pullRequestCommentsUrl = this.createPullRequestURL(
            id,
            "comments"
        );

        const resultsTable: DataTable = [];
        const response = await this.getRequest<unknown>(
            pullRequestCommentsUrl
        ).catch((err: unknown) => {
            errorHandler(this.getStatusCode(err), "comments", repo);
            return resultsTable;
        });
        if (
            validateSchema<GithubPullRequestCommentResponse[]>(
                response,
                pullRequestCommentsSchema()
            )
        ) {
            response.forEach(table => {
                let login: string;
                if (table.user === null) {
                    login = "Unknown User";
                } else {
                    login = table.user.login;
                }
                const commentUrl = table.html_url;
                resultsTable.push([login, commentUrl]);
            });
            return resultsTable;
        }
        return resultsTable;
    }

    async getPullRequest(id: number | string): Promise<DataTable> {
        const url = this.createPullRequestURL(id);
        const resultsTable: DataTable = [];
        const response = await this.getRequest<unknown>(url).catch(
            (err: unknown) => {
                errorHandler(
                    this.getStatusCode(err),
                    "PullRequestDetails",
                    repo
                );
                return resultsTable;
            }
        );
        if (
            validateSchema<GithubPullRequestDetailsResponse>(
                response,
                pullRequestDetailsSchema()
            )
        ) {
            const summary = [
                response.merged,
                response.additions,
                response.deletions,
                response.changed_files,
                response.mergeable_state,
                response.commits,
                response.comments,
                response.review_comments,
            ];
            resultsTable.push(summary);
        }
        return resultsTable;
    }

    async showPullRequestCommits(id: number | string): Promise<DataTable> {
        const pullRequestCommentsUrl = `${repo}/pulls/${id}/commits`;
        const resultsTable: DataTable = [];
        const response = await this.getRequest<unknown>(
            pullRequestCommentsUrl
        ).catch((err: unknown) => {
            errorHandler(this.getStatusCode(err), "commits", repo);
            return resultsTable;
        });
        if (
            validateSchema<GithubPullRequestCommitResponse[]>(
                response,
                pullRequestCommitsSchema()
            )
        ) {
            response.forEach(table => {
                resultsTable.push([
                    table.commit.committer.name,
                    table.commit.message,
                    table.html_url,
                ]);
            });
        }
        return resultsTable;
    }

    async showPullRequestFiles(id: number | string): Promise<DataTable> {
        const pullRequestFilesUrl = `${repo}/pulls/${id}/files`;
        const resultsTable: DataTable = [];
        const response = await this.getRequest<unknown>(
            pullRequestFilesUrl
        ).catch((err: unknown) => {
            errorHandler(this.getStatusCode(err), "pullRequestFiles", repo);
            return resultsTable;
        });
        if (
            validateSchema<GithubPullRequestFileResponse[]>(
                response,
                pullRequestFilesSchema()
            )
        ) {
            response.forEach(table => {
                resultsTable.push([
                    table.filename,
                    table.status,
                    `${clc.green(table.additions)}`,
                    `${clc.red(table.deletions)}`,
                    `${table.status}`,
                    `${table.changes}`,
                ]);
            });
        }
        return resultsTable;
    }
    async updatePullRequestStatus(
        id: number | string,
        state: string
    ): Promise<string> {
        const url = this.createPullRequestURL(id);

        const data = { state: state };
        const response = await this.patchRequest<unknown>(url, data).catch(
            (err: unknown) => {
                errorHandler(
                    this.getStatusCode(err),
                    "updatePullRequestStatus",
                    repo
                );
                return "";
            }
        );
        if (
            validateSchema<GithubPullRequestUpdateResponse>(
                response,
                pullrequestUpdateSchema()
            )
        ) {
            return response.state;
        }
        return "";
    }
    async addReviewers(
        id: number | string,
        reviewerNames: string[]
    ): Promise<string[]> {
        const addReviewersUrl = `/${repo}/pulls/${id}/requested_reviewers`;
        const result: string[] = [];
        const reviewerData = {
            reviewers: reviewerNames,
        };
        const response = await this.postRequest<unknown>(
            addReviewersUrl,
            reviewerData
        ).catch((err: unknown) => {
            errorHandler(this.getStatusCode(err), "addReviewers", repo);
            return result;
        });
        if (
            validateSchema<GithubReviewersResponse>(
                response,
                pullRequestAddReviewersSchema()
            )
        ) {
            response.requested_reviewers.forEach(name => {
                result.push(name.login);
            });
        }
        return result;
    }
    async removeReviewers(
        pullRequestId: number | string,
        reviewerNames: string[]
    ): Promise<string[]> {
        const removeReviewersUrl = `/${repo}/pulls/${pullRequestId}/requested_reviewers`;
        const resultsTable: string[] = [];
        const reviewerData = {
            reviewers: reviewerNames,
        };
        const response = await this.deleteRequest<unknown>(
            removeReviewersUrl,
            reviewerData
        ).catch((err: unknown) => {
            errorHandler(this.getStatusCode(err), "removeReviewers", repo);
            return resultsTable;
        });
        if (
            validateSchema<GithubReviewersResponse>(
                response,
                pullRequestAddReviewersSchema()
            )
        ) {
            response.requested_reviewers.forEach(name => {
                resultsTable.push(name.login);
            });
        }
        return resultsTable;
    }
    async mergePullRequest(pullRequestId: number | string): Promise<void> {
        const mergePullRequestURL = `/${repo}/pulls/${pullRequestId}/merge`;
        const response = await this.putRequest<GithubMergePullRequestResponse>(
            mergePullRequestURL,
            pullRequestId,
            undefined
        ).catch((err: unknown) => {
            errorHandler(this.getStatusCode(err), "mergePullRequest", repo);
            return undefined;
        });
        if (response === undefined) {
            return;
        }
        if (response.status === 200) {
            console.log(
                `Merged ${pullRequestId} ${response.data.message} successfully 💥`
            );
        } else if (response.status === 405 || response.status === 409) {
            console.error(
                `Failed to merge because ${
                    response.data.message
                } 😞 please open the PR ${clc.green("okgit pr <id> --web")}`
            );
        }
    }

    createPullRequestURL(id: number | string, prAttribute = ""): string {
        if (prAttribute !== "") {
            return `/${repo}/pulls/${id}/${prAttribute}`;
        }
        return `/${repo}/pulls/${id}`;
    }
    formatDate(dateString: string): string {
        return moment(dateString.split("T")[0], "YYYY-MM-DD").fromNow();
    }
}
