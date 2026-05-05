import createAPIBaseURL from "../../../utils/helpers";
import { GitlabMergeRequest } from "../gitlab/merge_requests/GitlabMergeRequest";
import { FileConfigStore } from "../../../config/ConfigStore";
import { createGitLabAuthHeadersFromConfig } from "../../authHeaders";
import { OkgitConfig } from "../../../types";

export function createGitlabMergeRequestApi(
    config: OkgitConfig
): GitlabMergeRequest {
    return new GitlabMergeRequest(
        createAPIBaseURL(
            config.organization_username,
            config.hosting_provider_choice
        ) ?? "",
        undefined,
        createGitLabAuthHeadersFromConfig(config)
    );
}

export const GitlabMR = createGitlabMergeRequestApi(
    new FileConfigStore().readConfig()
);
