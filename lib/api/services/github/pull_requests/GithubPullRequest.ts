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
import {
    PullRequestComment,
    PullRequestCommit,
    PullRequestFile,
    PullRequestListItem,
    PullRequestMergeResult,
    PullRequestProvider,
    PullRequestSummary,
} from "../../../../providers/contracts";
import {
    mapGithubPullRequestComment,
    mapGithubPullRequestCommit,
    mapGithubPullRequestFile,
    mapGithubPullRequestListItem,
    mapGithubPullRequestSummary,
} from "../../../../providers/github/mappers/pullRequests";
import {
    pullRequestCommentToRow,
    pullRequestCommitToRow,
    pullRequestFileToRow,
    pullRequestSummaryToRow,
} from "../../../../tables/mappers/pullRequests";

export class GithubPullRequest extends BaseAPI implements PullRequestProvider {
    constructor(baseURL: string, timeout?: number) {
        super(baseURL, timeout);
    }

    async createPullRequest(
        title: string,
        currentBranchName: string,
        baseBranchName: string,
        body: string
    ): Promise<string> {
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
            return "";
        }
        const createdPullRequest: GithubCreatePullRequestResponse = {
            html_url: createRepositoryResponse.html_url,
        };
        return createdPullRequest.html_url;
    }

    async listPullRequests(
        repoName: string,
        state: string | undefined
    ): Promise<PullRequestListItem[]> {
        const pullRequestState = state === undefined ? "open" : state;
        const getPullRequestUrl = `/${repoName}/pulls?state=${pullRequestState}`;

        const pullRequests: PullRequestListItem[] = [];
        const response = await this.getRequest<unknown>(
            getPullRequestUrl
        ).catch((err: unknown) => {
            errorHandler(this.getStatusCode(err), "pullRequests", repo);
            return pullRequests;
        });

        if (
            validateSchema<GithubPullRequestListItem[]>(
                response,
                pullrequestListSchema()
            )
        ) {
            response.forEach(obj => {
                pullRequests.push(
                    mapGithubPullRequestListItem(
                        obj,
                        pullRequestState,
                        this.formatDate
                    )
                );
            });
        }
        return pullRequests;
    }

    async getPullRequests(
        repoName: string,
        state: string | undefined
    ): Promise<DataTable> {
        const pullRequests = await this.listPullRequests(repoName, state);
        return pullRequests.map(pullRequest => [
            pullRequest.url,
            pullRequest.state,
            pullRequest.author,
            pullRequest.createdAt,
        ]);
    }

    async listPullRequestComments(
        id: number | string
    ): Promise<PullRequestComment[]> {
        const pullRequestCommentsUrl = this.createPullRequestURL(
            id,
            "comments"
        );

        const comments: PullRequestComment[] = [];
        const response = await this.getRequest<unknown>(
            pullRequestCommentsUrl
        ).catch((err: unknown) => {
            errorHandler(this.getStatusCode(err), "comments", repo);
            return comments;
        });
        if (
            validateSchema<GithubPullRequestCommentResponse[]>(
                response,
                pullRequestCommentsSchema()
            )
        ) {
            response.forEach(table => {
                comments.push(mapGithubPullRequestComment(table));
            });
            return comments;
        }
        return comments;
    }

    async showPullRequestComments(id: number | string): Promise<DataTable> {
        const comments = await this.listPullRequestComments(id);
        return comments.map(pullRequestCommentToRow);
    }

    async getPullRequestSummary(
        id: number | string
    ): Promise<PullRequestSummary | undefined> {
        const url = this.createPullRequestURL(id);
        const response = await this.getRequest<unknown>(url).catch(
            (err: unknown) => {
                errorHandler(
                    this.getStatusCode(err),
                    "PullRequestDetails",
                    repo
                );
                return undefined;
            }
        );
        if (response === undefined) {
            return undefined;
        }
        if (
            validateSchema<GithubPullRequestDetailsResponse>(
                response,
                pullRequestDetailsSchema()
            )
        ) {
            return mapGithubPullRequestSummary(response);
        }
        return undefined;
    }

    async getPullRequest(id: number | string): Promise<DataTable> {
        const summary = await this.getPullRequestSummary(id);
        if (summary === undefined) {
            return [];
        }
        return [pullRequestSummaryToRow(summary)];
    }

    async listPullRequestCommits(
        id: number | string
    ): Promise<PullRequestCommit[]> {
        const pullRequestCommentsUrl = `${repo}/pulls/${id}/commits`;
        const commits: PullRequestCommit[] = [];
        const response = await this.getRequest<unknown>(
            pullRequestCommentsUrl
        ).catch((err: unknown) => {
            errorHandler(this.getStatusCode(err), "commits", repo);
            return commits;
        });
        if (
            validateSchema<GithubPullRequestCommitResponse[]>(
                response,
                pullRequestCommitsSchema()
            )
        ) {
            response.forEach(table => {
                commits.push(mapGithubPullRequestCommit(table));
            });
        }
        return commits;
    }

    async showPullRequestCommits(id: number | string): Promise<DataTable> {
        const commits = await this.listPullRequestCommits(id);
        return commits.map(pullRequestCommitToRow);
    }

    async listPullRequestFiles(id: number | string): Promise<PullRequestFile[]> {
        const pullRequestFilesUrl = `${repo}/pulls/${id}/files`;
        const files: PullRequestFile[] = [];
        const response = await this.getRequest<unknown>(
            pullRequestFilesUrl
        ).catch((err: unknown) => {
            errorHandler(this.getStatusCode(err), "pullRequestFiles", repo);
            return files;
        });
        if (
            validateSchema<GithubPullRequestFileResponse[]>(
                response,
                pullRequestFilesSchema()
            )
        ) {
            response.forEach(table => {
                files.push(mapGithubPullRequestFile(table));
            });
        }
        return files;
    }

    async showPullRequestFiles(id: number | string): Promise<DataTable> {
        const files = await this.listPullRequestFiles(id);
        return files.map(pullRequestFileToRow);
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
    async mergePullRequest(
        pullRequestId: number | string
    ): Promise<PullRequestMergeResult | undefined> {
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
            return undefined;
        }
        return {
            status: response.status,
            message: response.data.message,
        };
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
