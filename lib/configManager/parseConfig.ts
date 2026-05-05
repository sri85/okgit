import {
    FileConfigStore,
    ConfigReadError,
    ConfigValidationError,
    getDefaultConfig,
} from "../config/ConfigStore";
import { getConfigToken } from "./tokenConfig";

let repo: string;
let org: string;
let token: string;
let hosting_provider: string | undefined;

function readLegacyConfig() {
    try {
        return new FileConfigStore().readConfig();
    } catch (err) {
        if (
            err instanceof ConfigReadError ||
            err instanceof ConfigValidationError
        ) {
            return getDefaultConfig();
        }
        throw err;
    }
}

if (process.env.IS_TESTING === "TRUE") {
    repo = "test";
    org = "octo";
    token = "123456";
} else {
    const config = readLegacyConfig();
    repo = config["repo"];
    org = config["organization_username"];
    token = getConfigToken(config);
    hosting_provider = config["hosting_provider_choice"];
}
export { repo, org, token, hosting_provider };
