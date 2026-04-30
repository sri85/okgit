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

import { repo } from "../../../../configManager/parseConfig";

type IssueUpdateData = string | string[];
type IssueUpdatePayload =
    | { labels: string[] }
    | { assignees: string[] }
    | { state: string };

export class GithubIssue extends BaseAPI {
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
    async getIssue(issueId: number | string): Promise<DataTable> {
        const url = `/${repo}/issues/${issueId}`;
        const result: DataTable = [];
        const getIssueResponse = await this.getRequest<unknown>(url).catch(
            (err: unknown) => {
                errorHandler(this.getStatusCode(err), "get-issue", repo);
                return result;
            }
        );
        if (
            validateSchema<GithubIssueResponse>(getIssueResponse, issueSchema())
        ) {
            result.push([
                getIssueResponse.html_url,
                getIssueResponse.user.login,
                getIssueResponse.state,
            ]);
        }
        return result;
    }
    async getIssues(): Promise<DataTable> {
        const getIssuesURL = `/${repo}/issues`;
        const result: DataTable = [];
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
                result.push([obj.html_url, obj.user.login, obj.state]);
            });
        }
        return result;
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
