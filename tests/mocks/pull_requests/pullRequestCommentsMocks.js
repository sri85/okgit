export const pullrequestCommentsMocks = [
    {
        url:
            "https://api.github.com/repos/getndazn/dapact/pulls/comments/320187757",
        pull_request_review_id: 282885176,
        id: 320187757,
        node_id: "MDI0OlB1bGxSZXF1ZXN0UmV2aWV3Q29tbWVudDMyMDE4Nzc1Nw==",
        diff_hunk:
            "@@ -1,8 +1,8 @@\n const express = require('express');\n const cors = require('cors');",
        path: "dapact-webhooks/src/index.js",
        position: 2,
        original_position: 2,
        commit_id: "00876555d91601a028e35c1ee7964381c67bbae0",
        original_commit_id: "00876555d91601a028e35c1ee7964381c67bbae0",
        user: {
            login: "sripathipai",
            id: 50827561,
            node_id: "MDQ6VXNlcjUwODI3NTYx",
            avatar_url: "https://avatars1.githubusercontent.com/u/50827561?v=4",
            gravatar_id: "",
            url: "https://api.github.com/users/sripathipai",
            html_url: "https://github.com/sripathipai",
            followers_url: "https://api.github.com/users/sripathipai/followers",
            following_url:
                "https://api.github.com/users/sripathipai/following{/other_user}",
            gists_url:
                "https://api.github.com/users/sripathipai/gists{/gist_id}",
            starred_url:
                "https://api.github.com/users/sripathipai/starred{/owner}{/repo}",
            subscriptions_url:
                "https://api.github.com/users/sripathipai/subscriptions",
            organizations_url: "https://api.github.com/users/sripathipai/orgs",
            repos_url: "https://api.github.com/users/sripathipai/repos",
            events_url:
                "https://api.github.com/users/sripathipai/events{/privacy}",
            received_events_url:
                "https://api.github.com/users/sripathipai/received_events",
            type: "User",
            site_admin: false,
        },
        body: "Why do we need this ?",
        created_at: "2019-09-03T09:54:21Z",
        updated_at: "2019-09-03T12:08:00Z",
        html_url:
            "https://github.com/getndazn/dapact/pull/10#discussion_r320187757",
        pull_request_url:
            "https://api.github.com/repos/getndazn/dapact/pulls/10",
        author_association: "CONTRIBUTOR",
        _links: {
            self: {
                href:
                    "https://api.github.com/repos/getndazn/dapact/pulls/comments/320187757",
            },
            html: {
                href:
                    "https://github.com/getndazn/dapact/pull/10#discussion_r320187757",
            },
            pull_request: {
                href: "https://api.github.com/repos/getndazn/dapact/pulls/10",
            },
        },
    },
    {
        url:
            "https://api.github.com/repos/getndazn/dapact/pulls/comments/320188887",
        pull_request_review_id: 282885176,
        id: 320188887,
        node_id: "MDI0OlB1bGxSZXF1ZXN0UmV2aWV3Q29tbWVudDMyMDE4ODg4Nw==",
        diff_hunk:
            "@@ -0,0 +1,72 @@\n+const axios = require('axios');\n+const { generateError } = require('./errorHandling');\n+\n+const findLatestSuccessfulBuildId = (buildArray, requiredBranch) => {\n+  try {\n+    const successfulBuilds = buildArray\n+      .filter(\n+        ({ branch, status, event }) => branch === requiredBranch\n+          && status === 'success'\n+          && event === 'push',\n+      );\n+\n+    if (successfulBuilds.length === 0) {\n+      throw 'Empty array after filtering';\n+    } else {\n+      return successfulBuilds[0].number;\n+    }\n+  } catch (err) {\n+    throw generateError(\n+      'FILTER_BUILDS_ERR',\n+      'Cannot find latest successful build',\n+      err,\n+    );\n+  }\n+};\n+\n+const getAllBuilds = async (owner, repo) => {\n+  const url = `${process.env.DRONE_SERVER}/api/repos/${owner}/${repo}/builds`;\n+  const options = { headers: { Authorization: `Bearer ${process.env.DRONE_TOKEN}` } };\n+\n+  try {\n+    const { data } = await axios.get(url, options);",
        path: "dapact-webhooks/src/lib/drone.js",
        position: 32,
        original_position: 32,
        commit_id: "00876555d91601a028e35c1ee7964381c67bbae0",
        original_commit_id: "00876555d91601a028e35c1ee7964381c67bbae0",
        user: {
            login: "sripathipai",
            id: 50827561,
            node_id: "MDQ6VXNlcjUwODI3NTYx",
            avatar_url: "https://avatars1.githubusercontent.com/u/50827561?v=4",
            gravatar_id: "",
            url: "https://api.github.com/users/sripathipai",
            html_url: "https://github.com/sripathipai",
            followers_url: "https://api.github.com/users/sripathipai/followers",
            following_url:
                "https://api.github.com/users/sripathipai/following{/other_user}",
            gists_url:
                "https://api.github.com/users/sripathipai/gists{/gist_id}",
            starred_url:
                "https://api.github.com/users/sripathipai/starred{/owner}{/repo}",
            subscriptions_url:
                "https://api.github.com/users/sripathipai/subscriptions",
            organizations_url: "https://api.github.com/users/sripathipai/orgs",
            repos_url: "https://api.github.com/users/sripathipai/repos",
            events_url:
                "https://api.github.com/users/sripathipai/events{/privacy}",
            received_events_url:
                "https://api.github.com/users/sripathipai/received_events",
            type: "User",
            site_admin: false,
        },
        body:
            "What does `data` have ? Does it get all the builds ? In that case can we rename the variable to something less verbose ",
        created_at: "2019-09-03T09:56:54Z",
        updated_at: "2019-09-03T12:08:00Z",
        html_url:
            "https://github.com/getndazn/dapact/pull/10#discussion_r320188887",
        pull_request_url:
            "https://api.github.com/repos/getndazn/dapact/pulls/10",
        author_association: "CONTRIBUTOR",
        _links: {
            self: {
                href:
                    "https://api.github.com/repos/getndazn/dapact/pulls/comments/320188887",
            },
            html: {
                href:
                    "https://github.com/getndazn/dapact/pull/10#discussion_r320188887",
            },
            pull_request: {
                href: "https://api.github.com/repos/getndazn/dapact/pulls/10",
            },
        },
    },
    {
        url:
            "https://api.github.com/repos/getndazn/dapact/pulls/comments/320189274",
        pull_request_review_id: 282885176,
        id: 320189274,
        node_id: "MDI0OlB1bGxSZXF1ZXN0UmV2aWV3Q29tbWVudDMyMDE4OTI3NA==",
        diff_hunk:
            "@@ -0,0 +1,72 @@\n+const axios = require('axios');\n+const { generateError } = require('./errorHandling');\n+\n+const findLatestSuccessfulBuildId = (buildArray, requiredBranch) => {\n+  try {\n+    const successfulBuilds = buildArray\n+      .filter(\n+        ({ branch, status, event }) => branch === requiredBranch\n+          && status === 'success'\n+          && event === 'push',\n+      );\n+\n+    if (successfulBuilds.length === 0) {\n+      throw 'Empty array after filtering';\n+    } else {\n+      return successfulBuilds[0].number;\n+    }\n+  } catch (err) {\n+    throw generateError(\n+      'FILTER_BUILDS_ERR',\n+      'Cannot find latest successful build',\n+      err,\n+    );\n+  }\n+};\n+\n+const getAllBuilds = async (owner, repo) => {\n+  const url = `${process.env.DRONE_SERVER}/api/repos/${owner}/${repo}/builds`;",
        path: "dapact-webhooks/src/lib/drone.js",
        position: 28,
        original_position: 28,
        commit_id: "00876555d91601a028e35c1ee7964381c67bbae0",
        original_commit_id: "00876555d91601a028e35c1ee7964381c67bbae0",
        user: {
            login: "sripathipai",
            id: 50827561,
            node_id: "MDQ6VXNlcjUwODI3NTYx",
            avatar_url: "https://avatars1.githubusercontent.com/u/50827561?v=4",
            gravatar_id: "",
            url: "https://api.github.com/users/sripathipai",
            html_url: "https://github.com/sripathipai",
            followers_url: "https://api.github.com/users/sripathipai/followers",
            following_url:
                "https://api.github.com/users/sripathipai/following{/other_user}",
            gists_url:
                "https://api.github.com/users/sripathipai/gists{/gist_id}",
            starred_url:
                "https://api.github.com/users/sripathipai/starred{/owner}{/repo}",
            subscriptions_url:
                "https://api.github.com/users/sripathipai/subscriptions",
            organizations_url: "https://api.github.com/users/sripathipai/orgs",
            repos_url: "https://api.github.com/users/sripathipai/repos",
            events_url:
                "https://api.github.com/users/sripathipai/events{/privacy}",
            received_events_url:
                "https://api.github.com/users/sripathipai/received_events",
            type: "User",
            site_admin: false,
        },
        body:
            "Just wondering should me move this out of the function , may be `enum` ",
        created_at: "2019-09-03T09:57:47Z",
        updated_at: "2019-09-03T12:08:00Z",
        html_url:
            "https://github.com/getndazn/dapact/pull/10#discussion_r320189274",
        pull_request_url:
            "https://api.github.com/repos/getndazn/dapact/pulls/10",
        author_association: "CONTRIBUTOR",
        _links: {
            self: {
                href:
                    "https://api.github.com/repos/getndazn/dapact/pulls/comments/320189274",
            },
            html: {
                href:
                    "https://github.com/getndazn/dapact/pull/10#discussion_r320189274",
            },
            pull_request: {
                href: "https://api.github.com/repos/getndazn/dapact/pulls/10",
            },
        },
    },
    {
        url:
            "https://api.github.com/repos/getndazn/dapact/pulls/comments/320189823",
        pull_request_review_id: 282885176,
        id: 320189823,
        node_id: "MDI0OlB1bGxSZXF1ZXN0UmV2aWV3Q29tbWVudDMyMDE4OTgyMw==",
        diff_hunk:
            "@@ -0,0 +1,72 @@\n+const axios = require('axios');\n+const { generateError } = require('./errorHandling');\n+\n+const findLatestSuccessfulBuildId = (buildArray, requiredBranch) => {\n+  try {\n+    const successfulBuilds = buildArray\n+      .filter(\n+        ({ branch, status, event }) => branch === requiredBranch\n+          && status === 'success'\n+          && event === 'push',\n+      );\n+\n+    if (successfulBuilds.length === 0) {\n+      throw 'Empty array after filtering';\n+    } else {\n+      return successfulBuilds[0].number;\n+    }\n+  } catch (err) {\n+    throw generateError(\n+      'FILTER_BUILDS_ERR',\n+      'Cannot find latest successful build',\n+      err,\n+    );\n+  }\n+};\n+\n+const getAllBuilds = async (owner, repo) => {\n+  const url = `${process.env.DRONE_SERVER}/api/repos/${owner}/${repo}/builds`;\n+  const options = { headers: { Authorization: `Bearer ${process.env.DRONE_TOKEN}` } };\n+\n+  try {\n+    const { data } = await axios.get(url, options);\n+\n+    return data;\n+  } catch (err) {\n+    throw generateError(\n+      'GET_BUILDS_DRONE_ERR',\n+      'Cannot GET all builds from Drone API',\n+      err,\n+    );\n+  }\n+};\n+\n+const startLatestSuccessfulBuild = async (reqBody) => {",
        path: "dapact-webhooks/src/lib/drone.js",
        position: 44,
        original_position: 44,
        commit_id: "00876555d91601a028e35c1ee7964381c67bbae0",
        original_commit_id: "00876555d91601a028e35c1ee7964381c67bbae0",
        user: {
            login: "sripathipai",
            id: 50827561,
            node_id: "MDQ6VXNlcjUwODI3NTYx",
            avatar_url: "https://avatars1.githubusercontent.com/u/50827561?v=4",
            gravatar_id: "",
            url: "https://api.github.com/users/sripathipai",
            html_url: "https://github.com/sripathipai",
            followers_url: "https://api.github.com/users/sripathipai/followers",
            following_url:
                "https://api.github.com/users/sripathipai/following{/other_user}",
            gists_url:
                "https://api.github.com/users/sripathipai/gists{/gist_id}",
            starred_url:
                "https://api.github.com/users/sripathipai/starred{/owner}{/repo}",
            subscriptions_url:
                "https://api.github.com/users/sripathipai/subscriptions",
            organizations_url: "https://api.github.com/users/sripathipai/orgs",
            repos_url: "https://api.github.com/users/sripathipai/repos",
            events_url:
                "https://api.github.com/users/sripathipai/events{/privacy}",
            received_events_url:
                "https://api.github.com/users/sripathipai/received_events",
            type: "User",
            site_admin: false,
        },
        body: "Is this the last successful master build ? ",
        created_at: "2019-09-03T09:59:10Z",
        updated_at: "2019-09-03T12:08:00Z",
        html_url:
            "https://github.com/getndazn/dapact/pull/10#discussion_r320189823",
        pull_request_url:
            "https://api.github.com/repos/getndazn/dapact/pulls/10",
        author_association: "CONTRIBUTOR",
        _links: {
            self: {
                href:
                    "https://api.github.com/repos/getndazn/dapact/pulls/comments/320189823",
            },
            html: {
                href:
                    "https://github.com/getndazn/dapact/pull/10#discussion_r320189823",
            },
            pull_request: {
                href: "https://api.github.com/repos/getndazn/dapact/pulls/10",
            },
        },
    },
    {
        url:
            "https://api.github.com/repos/getndazn/dapact/pulls/comments/320190358",
        pull_request_review_id: 282885176,
        id: 320190358,
        node_id: "MDI0OlB1bGxSZXF1ZXN0UmV2aWV3Q29tbWVudDMyMDE5MDM1OA==",
        diff_hunk:
            "@@ -0,0 +1,26 @@\n+const errorCodeToStatus = {\n+  VALIDATION_ERROR: 400,\n+  FILTER_BUILDS_ERR: 404,\n+  GET_BUILDS_DRONE_ERR: 400,\n+  START_BUILD_DRONE_ERR: 400,\n+};\n+\n+const generateError = (errorCode, message, originalError) => ({\n+  errorCode,\n+  message,\n+  originalError,\n+});\n+\n+const generateStatusCode = (errorObject) => {\n+  let statusCode;\n+\n+  if (Object.keys(errorCodeToStatus).includes(errorObject.errorCode)) {\n+    statusCode = errorCodeToStatus[errorObject.errorCode];\n+  } else {\n+    statusCode = 500;",
        path: "dapact-webhooks/src/lib/errorHandling.js",
        position: 20,
        original_position: 20,
        commit_id: "00876555d91601a028e35c1ee7964381c67bbae0",
        original_commit_id: "00876555d91601a028e35c1ee7964381c67bbae0",
        user: {
            login: "sripathipai",
            id: 50827561,
            node_id: "MDQ6VXNlcjUwODI3NTYx",
            avatar_url: "https://avatars1.githubusercontent.com/u/50827561?v=4",
            gravatar_id: "",
            url: "https://api.github.com/users/sripathipai",
            html_url: "https://github.com/sripathipai",
            followers_url: "https://api.github.com/users/sripathipai/followers",
            following_url:
                "https://api.github.com/users/sripathipai/following{/other_user}",
            gists_url:
                "https://api.github.com/users/sripathipai/gists{/gist_id}",
            starred_url:
                "https://api.github.com/users/sripathipai/starred{/owner}{/repo}",
            subscriptions_url:
                "https://api.github.com/users/sripathipai/subscriptions",
            organizations_url: "https://api.github.com/users/sripathipai/orgs",
            repos_url: "https://api.github.com/users/sripathipai/repos",
            events_url:
                "https://api.github.com/users/sripathipai/events{/privacy}",
            received_events_url:
                "https://api.github.com/users/sripathipai/received_events",
            type: "User",
            site_admin: false,
        },
        body: "Should we move this status code to `errorCodeToStatus`",
        created_at: "2019-09-03T10:00:28Z",
        updated_at: "2019-09-03T12:08:00Z",
        html_url:
            "https://github.com/getndazn/dapact/pull/10#discussion_r320190358",
        pull_request_url:
            "https://api.github.com/repos/getndazn/dapact/pulls/10",
        author_association: "CONTRIBUTOR",
        _links: {
            self: {
                href:
                    "https://api.github.com/repos/getndazn/dapact/pulls/comments/320190358",
            },
            html: {
                href:
                    "https://github.com/getndazn/dapact/pull/10#discussion_r320190358",
            },
            pull_request: {
                href: "https://api.github.com/repos/getndazn/dapact/pulls/10",
            },
        },
    },
    {
        url:
            "https://api.github.com/repos/getndazn/dapact/pulls/comments/320206621",
        pull_request_review_id: 282908900,
        id: 320206621,
        node_id: "MDI0OlB1bGxSZXF1ZXN0UmV2aWV3Q29tbWVudDMyMDIwNjYyMQ==",
        diff_hunk:
            "@@ -0,0 +1,72 @@\n+const axios = require('axios');\n+const { generateError } = require('./errorHandling');\n+\n+const findLatestSuccessfulBuildId = (buildArray, requiredBranch) => {\n+  try {\n+    const successfulBuilds = buildArray\n+      .filter(\n+        ({ branch, status, event }) => branch === requiredBranch\n+          && status === 'success'\n+          && event === 'push',\n+      );\n+\n+    if (successfulBuilds.length === 0) {\n+      throw 'Empty array after filtering';\n+    } else {\n+      return successfulBuilds[0].number;\n+    }\n+  } catch (err) {\n+    throw generateError(\n+      'FILTER_BUILDS_ERR',\n+      'Cannot find latest successful build',\n+      err,\n+    );\n+  }\n+};\n+\n+const getAllBuilds = async (owner, repo) => {",
        path: "dapact-webhooks/src/lib/drone.js",
        position: 27,
        original_position: 27,
        commit_id: "00876555d91601a028e35c1ee7964381c67bbae0",
        original_commit_id: "00876555d91601a028e35c1ee7964381c67bbae0",
        user: {
            login: "carlosbaraza",
            id: 1270425,
            node_id: "MDQ6VXNlcjEyNzA0MjU=",
            avatar_url: "https://avatars3.githubusercontent.com/u/1270425?v=4",
            gravatar_id: "",
            url: "https://api.github.com/users/carlosbaraza",
            html_url: "https://github.com/carlosbaraza",
            followers_url:
                "https://api.github.com/users/carlosbaraza/followers",
            following_url:
                "https://api.github.com/users/carlosbaraza/following{/other_user}",
            gists_url:
                "https://api.github.com/users/carlosbaraza/gists{/gist_id}",
            starred_url:
                "https://api.github.com/users/carlosbaraza/starred{/owner}{/repo}",
            subscriptions_url:
                "https://api.github.com/users/carlosbaraza/subscriptions",
            organizations_url: "https://api.github.com/users/carlosbaraza/orgs",
            repos_url: "https://api.github.com/users/carlosbaraza/repos",
            events_url:
                "https://api.github.com/users/carlosbaraza/events{/privacy}",
            received_events_url:
                "https://api.github.com/users/carlosbaraza/received_events",
            type: "User",
            site_admin: false,
        },
        body:
            "Here we can consume the endpoint that the DAZN CLI is consuming. (pe-drone-query)",
        created_at: "2019-09-03T10:43:31Z",
        updated_at: "2019-09-03T10:45:51Z",
        html_url:
            "https://github.com/getndazn/dapact/pull/10#discussion_r320206621",
        pull_request_url:
            "https://api.github.com/repos/getndazn/dapact/pulls/10",
        author_association: "CONTRIBUTOR",
        _links: {
            self: {
                href:
                    "https://api.github.com/repos/getndazn/dapact/pulls/comments/320206621",
            },
            html: {
                href:
                    "https://github.com/getndazn/dapact/pull/10#discussion_r320206621",
            },
            pull_request: {
                href: "https://api.github.com/repos/getndazn/dapact/pulls/10",
            },
        },
    },
];
