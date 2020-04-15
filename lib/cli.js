#!/usr/bin/env node
import repoCreateProgram from "./programs/services/github/repositoryCreateProgram";

const program = require("commander");
import listPullRequestProgram from "./programs/services/github/pullrequestListProgram";
import prDetails from "./programs/services/github/pullrequestDetailsProgram";
import createPullRequest from "./programs/services/github/pullrequestCreateProgram";
import createConfig from "./programs/config/createConfig";
import createIssue from "./programs/services/github/issueCreateProgram";
import issueDetails from "./programs/services/github/issueDetailsProgram";
import listIssues from "./programs/services/github/issueListProgram";
import switchRepoConfig from "./programs/config/switchConfig";
import repoDetailsProgram from "./programs/services/github/repoDetailsProgram";
import repoStarProgram from "./programs/services/github/repoStarProgram";
import showVersion from "./programs/commons/version";
import openRepo from "./programs/commons/openRepo";

listPullRequestProgram();
prDetails();
issueDetails();
listIssues();
createPullRequest();
createIssue();
createConfig();
switchRepoConfig();
repoDetailsProgram();
repoCreateProgram();
repoStarProgram();
showVersion();
openRepo();

program.parse(process.argv);
