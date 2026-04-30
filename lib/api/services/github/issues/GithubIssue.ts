import { BaseAPI } from "../../../BaseAPI";
import validateSchema from "../../../commons/validateSchema";
import { updateIssueSchema } from "../../../commons/schemas/issueSchema/updateIssueSchema";
import { createIssueSchema } from "../../../commons/schemas/issueSchema/createIssueSchema";
import { issueSchema } from "../../../commons/schemas/issueSchema/issueSchema";
import { listIssuesSchema } from "../../../commons/schemas/issueSchema/listIssuesSchema";
import errorHandler from "../../../../tables/utils/errorHandler";
import {
    DataTable,
    GithubIssueResponse,
    IssueUpdateAction,
} from "../../../../types";
import { IssueDetails, IssueProvider } from "../../../../providers/contracts";
import { mapGithubIssue } from "../../../../providers/github/mappers/issues";
import { issueDetailsToRow } from "../../../../tables/mappers/issues";

import { repo } from "../../../../configManager/parseConfig";

type IssueUpdateData = string | string[];
type IssueUpdatePayload =
    | { labels: string[] }
    | { assignees: string[] }
    | { state: string };

export class GithubIssue extends BaseAPI implements IssueProvider {
    constructor(baseURL: string, timeout?: number) {
        super(baseURL, timeout);
    }
    async createIssue(issueTitle: string, issueBody: string): Promise<string> {
        const createIssueUrl = `${repo}/issues`;
        const issueData = {
            title: issueTitle,
            body: issueBody,
        };
        let result = "";
        const createIssueResponse = await this.postRequest<unknown>(
            createIssueUrl,
            issueData
        ).catch((err: unknown) => {
            errorHandler(this.getStatusCode(err), "create-issue", repo);
            return result;
        });
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
        const url = `/${repo}/issues/${issueId}`;
        const getIssueResponse = await this.getRequest<unknown>(url).catch(
            (err: unknown) => {
                errorHandler(this.getStatusCode(err), "get-issue", repo);
                return undefined;
            }
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
        const getIssuesURL = `/${repo}/issues`;
        const result: IssueDetails[] = [];
        const getIssueResponse = await this.getRequest<unknown>(
            getIssuesURL
        ).catch((err: unknown) => {
            errorHandler(this.getStatusCode(err), "get-issues", repo);
            return result;
        });
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
        const closeIssueUrl = `${repo}/issues/${issue_number}`;
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
        const response = await this.patchRequest<unknown>(
            closeIssueUrl,
            updateData
        ).catch((err: unknown) => {
            errorHandler(this.getStatusCode(err), action, repo);
            return result;
        });
        if (
            validateSchema<GithubIssueResponse>(response, updateIssueSchema())
        ) {
            result = response.html_url;
        }
        return result;
    }
}
