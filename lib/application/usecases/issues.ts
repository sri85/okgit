import { okgitProvider } from "../../providers";
import { IssueDetails, OkgitProvider } from "../../providers/contracts";
import { IssueUpdateAction } from "../../types";

export function createIssueUseCases(provider: OkgitProvider) {
    return {
        createIssue(
            issueTitle: string,
            issueBody: string
        ): Promise<string> {
            return provider.issues.createIssue(issueTitle, issueBody);
        },

        getIssue(
            issueId: number | string
        ): Promise<IssueDetails | undefined> {
            return provider.issues.getIssueDetails(issueId);
        },

        listIssues(): Promise<IssueDetails[]> {
            return provider.issues.listIssues();
        },

        updateIssue(
            action: IssueUpdateAction,
            issueId: number | string,
            data: string | string[]
        ): Promise<string> {
            return provider.issues.updateIssue(action, issueId, data);
        },
    };
}

const issueUseCases = createIssueUseCases(okgitProvider);

export const createIssue = issueUseCases.createIssue;
export const getIssue = issueUseCases.getIssue;
export const listIssues = issueUseCases.listIssues;
export const updateIssue = issueUseCases.updateIssue;
