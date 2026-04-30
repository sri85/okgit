import path from "path";
import fs from "fs";
import { OkgitConfig } from "../types";

const homedir = require("os").homedir();
const filePath = path.join(homedir, "/.git-cli/config.json");
let repo: string;
let org: string;
let token: string;
let hosting_provider: string | undefined;

const defaultConfig: OkgitConfig = {
    repo: "",
    organization_username: "",
    personnel_access_token: "",
    hosting_provider_choice: "",
};

function readConfig(): OkgitConfig {
    try {
        const rawConfig = fs.readFileSync(filePath, "utf-8");
        return JSON.parse(rawConfig) as OkgitConfig;
    } catch {
        return defaultConfig;
    }
}

if (process.env.IS_TESTING === "TRUE") {
    repo = "test";
    org = "octo";
    token = "123456";
} else {
    const config = readConfig();
    repo = config["repo"];
    org = config["organization_username"];
    token = config["personnel_access_token"];
    hosting_provider = config["hosting_provider_choice"];
}
export { repo, org, token, hosting_provider };
