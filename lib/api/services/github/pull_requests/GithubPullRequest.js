import clc from "cli-color";
import moment from "moment";
import { repo } from "../../../../configManager/parseConfig";

import { BaseAPI } from "../../../BaseAPI";
import validateSchema from "../../../commons/validateSchema.js";
import { pullrequestListSchema } from "../../../commons/schemas/pullRequestSchema/pullrequestListSchema.js";
import { pullRequestCommentsSchema } from "../../../commons/schemas/pullRequestSchema/pullRequestCommentsSchema.js";
import { pullRequestDetailsSchema } from "../../../commons/schemas/pullRequestSchema/pullRequestDetailsSchema";
import { pullRequestCommitsSchema } from "../../../commons/schemas/pullRequestSchema/pullRequestCommitsSchema";
import { pullRequestFilesSchema } from "../../../commons/schemas/pullRequestSchema/pullRequestFilesSchema";
import { pullrequestUpdateSchema } from "../../../commons/schemas/pullRequestSchema/pullRequestUpdateStatus";
import { pullRequestAddReviewersSchema } from "../../../commons/schemas/pullRequestSchema/pullRequestAddReviewersSchema";
import errorHandler from "../../../../tables/utils/errorHandler";

export class GithubPullRequest extends BaseAPI {
    constructor(baseURL, timeout) {
        super(baseURL, timeout);
    }

    async createPullRequest(title, currentBranchName, baseBranchName, body) {
        const prData = {
            title: title,
            head: currentBranchName,
            base: baseBranchName,
            body: body,
        };
        const createRepositoryResponse = await this.postRequest(
            `/${repo}/pulls`,
            prData
        ).catch(err => {
            errorHandler(err["status"], "createPullRequest", repo);
            return;
        });
        console.log(
            `Created Pull Request ${
                createRepositoryResponse.html_url
            } 🚀 ${clc.green(
                "use okgit pr <id> --web "
            )} top open in your favorite browser`
        );
        return;
    }
    async getPullRequests(repoName, state) {
        const getPullRequestUrl = `/${repoName}/pulls?state=${state}`;
        if (state === undefined) {
            state = "open";
        }

        const PRDetailTable = [];
        const response = await this.getRequest(getPullRequestUrl).catch(err => {
            errorHandler(err["status"], "pullRequests", repo);
            return PRDetailTable;
        });

        if (validateSchema(response, pullrequestListSchema())) {
            response.forEach(obj => {
                const url = obj.html_url;
                const createdDate = this.formatDate(obj["created_at"]);
                const user = obj.user.login;
                PRDetailTable.push([url, state, user, createdDate]);
            });
        }
        return PRDetailTable;
    }
    async showPullRequestComments(id) {
        const pullRequestCommentsUrl = this.createPullRequestURL(
            id,
            "comments"
        );

        const resultsTable = [];
        const response = await this.getRequest(pullRequestCommentsUrl).catch(
            err => {
                errorHandler(err["status"], "comments", repo);
                return resultsTable;
            }
        );
        if (validateSchema(response, pullRequestCommentsSchema())) {
            response.forEach(table => {
                let login;
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

    async getPullRequest(id) {
        const url = this.createPullRequestURL(id);
        const resultsTable = [];
        const response = await this.getRequest(url).catch(err => {
            errorHandler(err["status"], "PullRequestDetails", repo);
            return resultsTable;
        });
        if (validateSchema(response, pullRequestDetailsSchema())) {
            const summary = [
                response["merged"],
                response["additions"],
                response["deletions"],
                response["changed_files"],
                response["mergeable_state"],
                response["commits"],
                response["comments"],
                response["review_comments"],
            ];
            resultsTable.push(summary);
        }
        return resultsTable;
    }

    async showPullRequestCommits(id) {
        const pullRequestCommentsUrl = `${repo}/pulls/${id}/commits`;
        const resultsTable = [];
        const response = await this.getRequest(pullRequestCommentsUrl).catch(
            err => {
                errorHandler(err["status"], "commits", repo);
                return resultsTable;
            }
        );
        if (validateSchema(response, pullRequestCommitsSchema())) {
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

    async showPullRequestFiles(id) {
        const pullRequestFilesUrl = `${repo}/pulls/${id}/files`;
        const resultsTable = [];
        const response = await this.getRequest(pullRequestFilesUrl).catch(
            err => {
                errorHandler(err["status"], "pullRequestFiles", repo);
                return resultsTable;
            }
        );
        if (validateSchema(response, pullRequestFilesSchema())) {
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
    async updatePullRequestStatus(id, state) {
        const url = this.createPullRequestURL(id);

        const data = { state: state };
        const response = await this.patchRequest(url, data).catch(err => {
            errorHandler(err["status"], "updatePullRequestStatus", repo);
            return "";
        });
        if (validateSchema(response, pullrequestUpdateSchema())) {
            return response["state"];
        }
        return "";
    }
    async addReviewers(id, reviewerNames) {
        const addReviewersUrl = `/${repo}/pulls/${id}/requested_reviewers`;
        let result = [];
        const reviewerData = {
            reviewers: reviewerNames,
        };
        const response = await this.postRequest(
            addReviewersUrl,
            reviewerData
        ).catch(err => {
            errorHandler(err["status"], "addReviewers", repo);
            return result;
        });
        if (validateSchema(response, pullRequestAddReviewersSchema())) {
            response["requested_reviewers"].forEach(name => {
                result.push(name.login);
            });
        }
        return result;
    }
    async removeReviewers(pullRequestId, reviewerNames) {
        const removeReviewersUrl = `/${repo}/pulls/${pullRequestId}/requested_reviewers`;
        const resultsTable = [];
        const reviewerData = {
            reviewers: reviewerNames,
        };
        const response = await this.deleteRequest(
            removeReviewersUrl,
            reviewerData
        ).catch(err => {
            errorHandler(err["status"], "removeReviewers", repo);
            return resultsTable;
        });
        if (validateSchema(response, pullRequestAddReviewersSchema())) {
            response["requested_reviewers"].forEach(name => {
                resultsTable.push(name.login);
            });
        }
        return resultsTable;
    }
    async mergePullRequest(pullRequestId) {
        const mergePullRequestURL = `/${repo}/pulls/${pullRequestId}/merge`;
        const response = await this.putRequest(
            mergePullRequestURL,
            pullRequestId,
            undefined
        ).catch(err => {
            errorHandler(err["status"], "mergePullRequest", repo);
        });
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

    createPullRequestURL(id, prAttribute = "") {
        if (prAttribute !== "") {
            return `/${repo}/pulls/${id}/${prAttribute}`;
        }
        return `/${repo}/pulls/${id}`;
    }
    formatDate(dateString) {
        return moment(dateString.split("T")[0], "YYYY-MM-DD").fromNow();
    }
}
