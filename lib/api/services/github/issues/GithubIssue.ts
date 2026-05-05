import { BaseAPI } from "../../../BaseAPI";
import { HttpClient } from "../../../httpClient";
import { withLegacyProviderErrorHandling } from "../../../providerErrors";
import validateSchema from "../../../commons/validateSchema";
import { updateIssueSchema } from "../../../commons/schemas/issueSchema/updateIssueSchema";
import { createIssueSchema } from "../../../commons/schemas/issueSchema/createIssueSchema";
import { issueSchema } from "../../../commons/schemas/issueSchema/issueSchema";
import { listIssuesSchema } from "../../../commons/schemas/issueSchema/listIssuesSchema";
import {
    DataTable,
    GithubIssueResponse,
    IssueUpdateAction,
} from "../../../../types";
import { IssueDetails, IssueProvider } from "../../../../providers/contracts";
import { mapGithubIssue } from "../../../../providers/github/mappers/issues";
import { issueDetailsToRow } from "../../../../tables/mappers/issues";

import { repo as configuredRepo } from "../../../../configManager/parseConfig";
import { createGitHubAuthHeaders } from "../../../authHeaders";

type IssueUpdateData = string | string[];
type IssueUpdatePayload =
    | { labels: string[] }
    | { assignees: string[] }
    | { state: string };

export class GithubIssue implements IssueProvider {
    private readonly client: HttpClient;

    constructor(
        baseURL: string,
        timeout?: number,
        private readonly repoName = configuredRepo,
        token?: string,
        client?: HttpClient
    ) {
        this.client =
            client ??
            new BaseAPI(
                baseURL,
                timeout,
                token === undefined ? undefined : createGitHubAuthHeaders(token)
            );
    }

    static fromHttpClient(repoName: string, client: HttpClient): GithubIssue {
        return new GithubIssue("", undefined, repoName, undefined, client);
    }

    async createIssue(issueTitle: string, issueBody: string): Promise<string> {
        const createIssueUrl = `${this.repoName}/issues`;
        const issueData = {
            title: issueTitle,
            body: issueBody,
        };
        let result = "";
        const createIssueResponse = await withLegacyProviderErrorHandling(
            this.client.post<unknown>(createIssueUrl, issueData),
            { action: "create-issue", resource: this.repoName },
            result
        );
        if (
            validateSchema<GithubIssueResponse>(
                createIssueResponse,
                createIssueSchema()
            )
        ) {
            result = createIssueResponse.html_url;
        }
        return result;
    }

    async getIssueDetails(
        issueId: number | string
    ): Promise<IssueDetails | undefined> {
        const url = `/${this.repoName}/issues/${issueId}`;
        const getIssueResponse = await withLegacyProviderErrorHandling(
            this.client.get<unknown>(url),
            { action: "get-issue", resource: this.repoName },
            undefined
        );
        if (getIssueResponse === undefined) {
            return undefined;
        }
        if (
            validateSchema<GithubIssueResponse>(getIssueResponse, issueSchema())
        ) {
            return mapGithubIssue(getIssueResponse);
        }
        return undefined;
    }

    async getIssue(issueId: number | string): Promise<DataTable> {
        const issue = await this.getIssueDetails(issueId);
        if (issue === undefined) {
            return [];
        }
        return [issueDetailsToRow(issue)];
    }

    async listIssues(): Promise<IssueDetails[]> {
        const getIssuesURL = `/${this.repoName}/issues`;
        const result: IssueDetails[] = [];
        const getIssueResponse = await withLegacyProviderErrorHandling(
            this.client.get<unknown>(getIssuesURL),
            { action: "get-issues", resource: this.repoName },
            result
        );
        if (
            validateSchema<GithubIssueResponse[]>(
                getIssueResponse,
                listIssuesSchema()
            )
        ) {
            getIssueResponse.forEach(obj => {
                result.push(mapGithubIssue(obj));
            });
        }
        return result;
    }

    async getIssues(): Promise<DataTable> {
        const issues = await this.listIssues();
        return issues.map(issueDetailsToRow);
    }

    async updateIssue(
        action: IssueUpdateAction,
        issue_number: number | string,
        data: IssueUpdateData
    ): Promise<string> {
        const closeIssueUrl = `${this.repoName}/issues/${issue_number}`;
        let updateData: IssueUpdatePayload = { state: "" };
        switch (action.toLowerCase()) {
            case "label":
                updateData = {
                    labels: Array.isArray(data) ? data : [data],
                };
                break;
            case "assign":
                updateData = {
                    assignees: Array.isArray(data) ? data : [data],
                };
                break;
            case "close":
                updateData = {
                    state: Array.isArray(data) ? data.join(",") : data,
                };
                break;
        }

        let result = "";
        const response = await withLegacyProviderErrorHandling(
            this.client.patch<unknown>(closeIssueUrl, updateData),
            { action, resource: this.repoName },
            result
        );
        if (
            validateSchema<GithubIssueResponse>(response, updateIssueSchema())
        ) {
            result = response.html_url;
        }
        return result;
    }
}
