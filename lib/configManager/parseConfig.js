import path from "path";

const homedir = require("os").homedir();
const filePath = path.join(homedir, "/.git-cli/config.json");
const config = require(filePath);
let repo, org, token, hosting_provider;

if (process.env.IS_TESTING === "TRUE") {
    repo = "dapact";
    org = "getndazn";
    token = "123456";
} else {
    repo = config["repo"];
    org = config["organization_username"];
    token = config["personnel_access_token"];
    hosting_provider = config["hosting_provider_choice"];
}
export { repo, org, token, hosting_provider };
