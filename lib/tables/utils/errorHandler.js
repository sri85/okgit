import printErrorMessage from "./printErrorMessage";
import {
    NOT_FOUND_TEXT,
    UNAUTHORIZED_TEXT,
    FORBIDDEN_TEXT,
    INTERNAL_SERVER_ERROR_TEXT,
    UNPROCESSABLE_TEXT,
} from "./constants";

import clc from "cli-color";

export default function errorHandler(statusCode, action, repo) {
    switch (statusCode) {
        case 404:
            printErrorMessage(
                `${NOT_FOUND_TEXT} ${action} for repository ${clc.green(
                    repo
                )}, got ${statusCode} 🚫, please re-check the repo name and reconfigure by running ${clc.green(
                    "okgit switchrepo"
                )}`
            );
            break;
        case 401:
            printErrorMessage(
                `${UNAUTHORIZED_TEXT} to ${action} for repository ${clc.green(
                    repo
                )}, got ${statusCode} 🚫, please re-check the token and reconfigure okgit by running ${clc.green(
                    "okgit config"
                )}`
            );
            break;
        case 403:
            printErrorMessage(
                `${FORBIDDEN_TEXT} to ${action} for repository ${clc.green(
                    repo
                )}, got ${statusCode} 🚫, please re-check if you have permissions to access ${repo} or check if yout token has right permissions and then reconfigure okgit by running ${clc.green(
                    "okgit config"
                )}`
            );
            break;
        case 500:
            printErrorMessage(
                `Got ${INTERNAL_SERVER_ERROR_TEXT} while ${action}for repository ${clc.green(
                    repo
                )}, got ${statusCode} 🚫, please try again later.`
            );
            break;
        case 422:
            printErrorMessage(
                `Got ${UNPROCESSABLE_TEXT} while ${action}for repository ${clc.green(
                    repo
                )}, got ${statusCode} 🚫, please try again later.`
            );
            break;
        default:
            console.error(
                "Something has gone wrong while trying to perform the action"
            );
    }
}
