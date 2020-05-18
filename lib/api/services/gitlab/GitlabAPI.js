import createAPIBaseURL from "../../../utils/helpers";
import { GitlabMergeRequest } from "../gitlab/merge_requests/GitlabMergeRequest";
import { org, hosting_provider } from "../../../configManager/parseConfig";

export const GitlabMR = new GitlabMergeRequest(
    createAPIBaseURL(org, hosting_provider)
);
