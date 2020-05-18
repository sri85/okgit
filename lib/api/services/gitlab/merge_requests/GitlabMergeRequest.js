import { BaseAPI } from "../../../BaseAPI";
import { getMergeRequestsSchema } from "../../../commons/schemas/mergeRequestSchema/getMergeRequestsSchema";
import errorHandler from "../../../../tables/utils/errorHandler";
import validateSchema from "../../../commons/validateSchema";
import { projectsSchema } from "../../../commons/schemas/mergeRequestSchema/projectsSchema";

export class GitlabMergeRequest extends BaseAPI {
    constructor(baseURL, timeout) {
        super(baseURL, timeout);
    }
    async listMergeRequests(org, project, state) {
        const projectId = await this.getProjectId(org, project);
        const getMergeRequestUrl = `/projects/${projectId}/merge_requests`;
        if (state === undefined) {
            state = "open";
        }
        const mergeRequestsTable = [];
        const response = await this.getRequest(getMergeRequestUrl).catch(
            err => {
                errorHandler(err["status"], "mergeRequests", project);
                return mergeRequestsTable;
            }
        );

        for (let i = 0; i < response.length; i++) {
            if (validateSchema(response[i], getMergeRequestsSchema())) {
                mergeRequestsTable.push([
                    response[i].web_url,
                    response[i].state,
                    response[i].author.name,
                    response[i].created_at.toString(),
                ]);
            }
        }
        return mergeRequestsTable;
    }

    async getProjectId(userName, projectName) {
        const userUrl = `/users/${userName}/projects?simple=true`;

        const userRepositories = await this.getRequest(userUrl).catch(err => {
            errorHandler(err["status"], "getProjectId", projectName);
        });
        for (let i = 0; i < userRepositories.length; i++) {
            if (validateSchema(userRepositories[i], projectsSchema())) {
                if (userRepositories[i].name === projectName) {
                    return userRepositories[i].id;
                }
            }
        }
    }
}
