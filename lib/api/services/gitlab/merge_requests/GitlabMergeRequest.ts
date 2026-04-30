import { BaseAPI } from "../../../BaseAPI";
import { getMergeRequestsSchema } from "../../../commons/schemas/mergeRequestSchema/getMergeRequestsSchema";
import errorHandler from "../../../../tables/utils/errorHandler";
import validateSchema from "../../../commons/validateSchema";
import { projectsSchema } from "../../../commons/schemas/mergeRequestSchema/projectsSchema";
import {
    DataTable,
    GitlabMergeRequestResponse,
    GitlabProjectResponse,
} from "../../../../types";

export class GitlabMergeRequest extends BaseAPI {
    constructor(baseURL: string, timeout?: number) {
        super(baseURL, timeout);
    }
    async listMergeRequests(
        org: string,
        project: string,
        state: string | undefined
    ): Promise<DataTable> {
        const projectId = await this.getProjectId(org, project);
        const getMergeRequestUrl = `/projects/${projectId}/merge_requests`;
        if (state === undefined) {
            state = "open";
        }
        const mergeRequestsTable: DataTable = [];
        const response = await this.getRequest<unknown>(
            getMergeRequestUrl
        ).catch((err: unknown) => {
            errorHandler(this.getStatusCode(err), "mergeRequests", project);
            return mergeRequestsTable;
        });

        if (Array.isArray(response)) {
            for (let i = 0; i < response.length; i++) {
                const mergeRequest = response[i];
                if (
                    validateSchema<GitlabMergeRequestResponse>(
                        mergeRequest,
                        getMergeRequestsSchema()
                    )
                ) {
                    mergeRequestsTable.push([
                        mergeRequest.web_url,
                        mergeRequest.state,
                        mergeRequest.author.name,
                        mergeRequest.created_at.toString(),
                    ]);
                }
            }
        }
        return mergeRequestsTable;
    }

    async getProjectId(
        userName: string,
        projectName: string
    ): Promise<number | undefined> {
        const userUrl = `/users/${userName}/projects?simple=true`;

        const userRepositories = await this.getRequest<unknown>(userUrl).catch(
            (err: unknown) => {
                errorHandler(
                    this.getStatusCode(err),
                    "getProjectId",
                    projectName
                );
                return [];
            }
        );
        if (!Array.isArray(userRepositories)) {
            return undefined;
        }
        for (let i = 0; i < userRepositories.length; i++) {
            const repository = userRepositories[i];
            if (
                validateSchema<GitlabProjectResponse>(
                    repository,
                    projectsSchema()
                )
            ) {
                if (repository.name === projectName) {
                    return repository.id;
                }
            }
        }
        return undefined;
    }
}
