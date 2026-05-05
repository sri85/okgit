import moment from "moment";
import { repo as configuredRepo } from "../../../../configManager/parseConfig";
import { createGitHubAuthHeaders } from "../../../authHeaders";

import { BaseAPI } from "../../../BaseAPI";
import { HttpClient } from "../../../httpClient";
import { withLegacyProviderErrorHandling } from "../../../providerErrors";
import validateSchema from "../../../commons/validateSchema";
import { pullrequestListSchema } from "../../../commons/schemas/pullRequestSchema/pullrequestListSchema";
import { pullRequestCommentsSchema } from "../../../commons/schemas/pullRequestSchema/pullRequestCommentsSchema";
import { pullRequestDetailsSchema } from "../../../commons/schemas/pullRequestSchema/pullRequestDetailsSchema";
import { pullRequestCommitsSchema } from "../../../commons/schemas/pullRequestSchema/pullRequestCommitsSchema";
import { pullRequestFilesSchema } from "../../../commons/schemas/pullRequestSchema/pullRequestFilesSchema";
import { pullrequestUpdateSchema } from "../../../commons/schemas/pullRequestSchema/pullRequestUpdateStatus";
import { pullRequestAddReviewersSchema } from "../../../commons/schemas/pullRequestSchema/pullRequestAddReviewersSchema";
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
    private readonly client: HttpClient;

    constructor(
        baseURL: string,
        timeout?: number,
        private readonly repoName = configuredRepo,
        token?: string,
        client?: HttpClient
    ) {
        super(
            baseURL,
            timeout,
            token === undefined ? undefined : createGitHubAuthHeaders(token)
        );
        this.client = client ?? this;
    }

    static fromHttpClient(
        repoName: string,
        client: HttpClient
    ): GithubPullRequest {
        return new GithubPullRequest("", undefined, repoName, undefined, client);
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
        const createRepositoryResponse = await withLegacyProviderErrorHandling(
            this.client.post<unknown>(`/${this.repoName}/pulls`, prData),
            { action: "createPullRequest", resource: this.repoName },
            undefined
        );
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
        const response = await withLegacyProviderErrorHandling(
            this.client.get<unknown>(getPullRequestUrl),
            { action: "pullRequests", resource: this.repoName },
            pullRequests
        );

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
        const response = await withLegacyProviderErrorHandling(
            this.client.get<unknown>(pullRequestCommentsUrl),
            { action: "comments", resource: this.repoName },
            comments
        );
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
        const response = await withLegacyProviderErrorHandling(
            this.client.get<unknown>(url),
            { action: "PullRequestDetails", resource: this.repoName },
            undefined
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
        const pullRequestCommentsUrl = `${this.repoName}/pulls/${id}/commits`;
        const commits: PullRequestCommit[] = [];
        const response = await withLegacyProviderErrorHandling(
            this.client.get<unknown>(pullRequestCommentsUrl),
            { action: "commits", resource: this.repoName },
            commits
        );
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
        const pullRequestFilesUrl = `${this.repoName}/pulls/${id}/files`;
        const files: PullRequestFile[] = [];
        const response = await withLegacyProviderErrorHandling(
            this.client.get<unknown>(pullRequestFilesUrl),
            { action: "pullRequestFiles", resource: this.repoName },
            files
        );
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
        const response = await withLegacyProviderErrorHandling(
            this.client.patch<unknown>(url, data),
            { action: "updatePullRequestStatus", resource: this.repoName },
            ""
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
        const addReviewersUrl = `/${this.repoName}/pulls/${id}/requested_reviewers`;
        const result: string[] = [];
        const reviewerData = {
            reviewers: reviewerNames,
        };
        const response = await withLegacyProviderErrorHandling(
            this.client.post<unknown>(addReviewersUrl, reviewerData),
            { action: "addReviewers", resource: this.repoName },
            result
        );
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
        const removeReviewersUrl = `/${this.repoName}/pulls/${pullRequestId}/requested_reviewers`;
        const resultsTable: string[] = [];
        const reviewerData = {
            reviewers: reviewerNames,
        };
        const response = await withLegacyProviderErrorHandling(
            this.client.delete<unknown>(removeReviewersUrl, reviewerData),
            { action: "removeReviewers", resource: this.repoName },
            resultsTable
        );
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
        const mergePullRequestURL = `/${this.repoName}/pulls/${pullRequestId}/merge`;
        const response = await withLegacyProviderErrorHandling(
            this.client.put<GithubMergePullRequestResponse>(
                mergePullRequestURL,
                pullRequestId,
                undefined
            ),
            { action: "mergePullRequest", resource: this.repoName },
            undefined
        );
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
            return `/${this.repoName}/pulls/${id}/${prAttribute}`;
        }
        return `/${this.repoName}/pulls/${id}`;
    }
    formatDate(dateString: string): string {
        return moment(dateString.split("T")[0], "YYYY-MM-DD").fromNow();
    }
}
