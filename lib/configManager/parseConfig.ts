import path from "path";
import { OkgitConfig } from "../types";

const homedir = require("os").homedir();
const filePath = path.join(homedir, "/.git-cli/config.json");
let repo: string;
let org: string;
let token: string;
let hosting_provider: string | undefined;

if (process.env.IS_TESTING === "TRUE") {
    repo = "test";
    org = "octo";
    token = "123456";
} else {
    const config = require(filePath) as OkgitConfig;
    repo = config["repo"];
    org = config["organization_username"];
    token = config["personnel_access_token"];
    hosting_provider = config["hosting_provider_choice"];
}
export { repo, org, token, hosting_provider };
