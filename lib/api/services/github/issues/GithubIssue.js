import { BaseAPI } from "../../../BaseAPI";
import validateSchema from "../../../commons/validateSchema";
import { updateIssueSchema } from "../../../commons/schemas/issueSchema/updateIssueSchema";
import { createIssueSchema } from "../../../commons/schemas/issueSchema/createIssueSchema";
import { issueSchema } from "../../../commons/schemas/issueSchema/issueSchema";
import { listIssuesSchema } from "../../../commons/schemas/issueSchema/listIssuesSchema";

const { repo } = require("../../../../configManager/parseConfig");

export class GithubIssue extends BaseAPI {
    constructor(baseURL, timeout) {
        super(baseURL, timeout);
    }
    async createIssue(issueTitle, issueBody) {
        const createIssueUrl = `${repo}/issues`;
        const issueData = {
            title: issueTitle,
            body: issueBody,
        };
        let result = "";
        const createIssueResponse = await this.postRequest(
            createIssueUrl,
            issueData
        ).catch(err => {
            console.error(`Error ${err}`);
            return result;
        });
        if (validateSchema(createIssueResponse, createIssueSchema())) {
            result = createIssueResponse["html_url"];
        }
        return result;
    }
    async getIssue(issueId) {
        const url = `/${repo}/issues/${issueId}`;
        let result = [];
        const getIssueResponse = await this.getRequest(url).catch(err => {
            console.error(`Error while getting issue details ${err}`);
            return result;
        });
        if (validateSchema(getIssueResponse, issueSchema())) {
            result.push([
                getIssueResponse["html_url"],
                getIssueResponse["user"]["login"],
                getIssueResponse["state"],
            ]);
        }
        return result;
    }
    async getIssues() {
        const getIssuesURL = `/${repo}/issues`;
        let result = [];
        const getIssueResponse = await this.getRequest(getIssuesURL).catch(
            err => {
                console.error(`Error while getting issue details ${err}`);
                return result;
            }
        );
        if (validateSchema(getIssueResponse, listIssuesSchema())) {
            getIssueResponse.forEach(obj => {
                result.push([
                    obj["html_url"],
                    obj["user"]["login"],
                    obj["state"],
                ]);
            });
        }
        return result;
    }

    async updateIssue(action, issue_number, data) {
        const closeIssueUrl = `${repo}/issues/${issue_number}`;
        let updateData;
        switch (action.toLowerCase()) {
            case "label":
                updateData = {
                    labels: data,
                };
                break;
            case "assign":
                updateData = {
                    assignees: data,
                };
                break;
            case "close":
                updateData = {
                    state: data,
                };
                break;
        }

        let result = "";
        const response = await this.patchRequest(
            closeIssueUrl,
            updateData
        ).catch(error => {
            console.error(`Error while ${action} the issue ${error}`);
            return result;
        });
        if (validateSchema(response, updateIssueSchema())) {
            result = response["html_url"];
        }
        return result;
    }
}
