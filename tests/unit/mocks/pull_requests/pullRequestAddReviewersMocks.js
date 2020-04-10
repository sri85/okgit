export const pullRequestAddReviewersMocks = {
    url: "https://api.github.com/repos/octo/test/pulls/12",
    id: 375009607,
    node_id: "MDExOlB1bGxSZXF1ZXN0Mzc1MDA5NjA3",
    html_url: "https://github.com/octo/test/pull/43",
    diff_url: "https://github.com/octo/test/pull/43.diff",
    patch_url: "https://github.com/octo/test/pull/43.patch",
    issue_url: "https://api.github.com/repos/octo/test/issues/43",
    number: 12,
    state: "closed",
    locked: false,
    title: "This is a test branch",
    user: {
        login: "sri85",
        id: 50827561,
        node_id: "MDQ6VXNlcjUwODI3NTYx",
        avatar_url: "https://avatars1.githubusercontent.com/u/50827561?v=4",
        gravatar_id: "",
        url: "https://api.github.com/users/sri85",
        html_url: "https://github.com/sri85",
        followers_url: "https://api.github.com/users/sri85/followers",
        following_url:
            "https://api.github.com/users/sri85/following{/other_user}",
        gists_url: "https://api.github.com/users/sri85/gists{/gist_id}",
        starred_url:
            "https://api.github.com/users/sri85/starred{/owner}{/repo}",
        subscriptions_url: "https://api.github.com/users/sri85/subscriptions",
        organizations_url: "https://api.github.com/users/sri85/orgs",
        repos_url: "https://api.github.com/users/sri85/repos",
        events_url: "https://api.github.com/users/sri85/events{/privacy}",
        received_events_url:
            "https://api.github.com/users/sri85/received_events",
        type: "User",
        site_admin: false,
    },
    body: null,
    created_at: "2020-02-13T17:57:54Z",
    updated_at: "2020-02-25T17:30:57Z",
    closed_at: "2020-02-25T16:57:03Z",
    merged_at: null,
    merge_commit_sha: "2bfc253f998d3ef7d1d37d95044e2d1ebff45641",
    assignee: null,
    assignees: [],
    requested_reviewers: [
        {
            login: "sri85",
            id: 25036532,
            node_id: "MDQ6VXNlcjI1MDM2NTMy",
            avatar_url: "https://avatars2.githubusercontent.com/u/25036532?v=4",
            gravatar_id: "",
            url: "https://api.github.com/users/sri85",
            html_url: "https://github.com/sri85",
            followers_url: "https://api.github.com/users/sri85/followers",
            following_url:
                "https://api.github.com/users/sri85/following{/other_user}",
            gists_url: "https://api.github.com/users/sri85/gists{/gist_id}",
            starred_url:
                "https://api.github.com/users/sri85/starred{/owner}{/repo}",
            subscriptions_url:
                "https://api.github.com/users/sri85/subscriptions",
            organizations_url: "https://api.github.com/users/sri85/orgs",
            repos_url: "https://api.github.com/users/sri85/repos",
            events_url: "https://api.github.com/users/sri85/events{/privacy}",
            received_events_url:
                "https://api.github.com/users/sri85/received_events",
            type: "User",
            site_admin: false,
        },
    ],
    requested_teams: [],
    labels: [],
    milestone: null,
    commits_url: "https://api.github.com/repos/octo/test/pulls/43/commits",
    review_comments_url:
        "https://api.github.com/repos/octo/test/pulls/43/comments",
    review_comment_url:
        "https://api.github.com/repos/octo/test/pulls/comments{/number}",
    comments_url: "https://api.github.com/repos/octo/test/issues/43/comments",
    statuses_url:
        "https://api.github.com/repos/octo/test/statuses/168c42f4cda8933fbe5ce728c7bb34289fa08304",
    head: {
        label: "octo:task/test-branch",
        ref: "task/test-branch",
        sha: "168c42f4cda8933fbe5ce728c7bb34289fa08304",
        user: {
            login: "octo",
            id: 21194695,
            node_id: "MDEyOk9yZ2FuaXphdGlvbjIxMTk0Njk1",
            avatar_url: "https://avatars2.githubusercontent.com/u/21194695?v=4",
            gravatar_id: "",
            url: "https://api.github.com/users/octo",
            html_url: "https://github.com/octo",
            followers_url: "https://api.github.com/users/octo/followers",
            following_url:
                "https://api.github.com/users/octo/following{/other_user}",
            gists_url: "https://api.github.com/users/octo/gists{/gist_id}",
            starred_url:
                "https://api.github.com/users/octo/starred{/owner}{/repo}",
            subscriptions_url:
                "https://api.github.com/users/octo/subscriptions",
            organizations_url: "https://api.github.com/users/octo/orgs",
            repos_url: "https://api.github.com/users/octo/repos",
            events_url: "https://api.github.com/users/octo/events{/privacy}",
            received_events_url:
                "https://api.github.com/users/octo/received_events",
            type: "Organization",
            site_admin: false,
        },
        repo: {
            id: 167577151,
            node_id: "MDEwOlJlcG9zaXRvcnkxNjc1NzcxNTE=",
            name: "test",
            full_name: "octo/test",
            private: true,
            owner: {
                login: "octo",
                id: 21194695,
                node_id: "MDEyOk9yZ2FuaXphdGlvbjIxMTk0Njk1",
                avatar_url:
                    "https://avatars2.githubusercontent.com/u/21194695?v=4",
                gravatar_id: "",
                url: "https://api.github.com/users/octo",
                html_url: "https://github.com/octo",
                followers_url: "https://api.github.com/users/octo/followers",
                following_url:
                    "https://api.github.com/users/octo/following{/other_user}",
                gists_url: "https://api.github.com/users/octo/gists{/gist_id}",
                starred_url:
                    "https://api.github.com/users/octo/starred{/owner}{/repo}",
                subscriptions_url:
                    "https://api.github.com/users/octo/subscriptions",
                organizations_url: "https://api.github.com/users/octo/orgs",
                repos_url: "https://api.github.com/users/octo/repos",
                events_url:
                    "https://api.github.com/users/octo/events{/privacy}",
                received_events_url:
                    "https://api.github.com/users/octo/received_events",
                type: "Organization",
                site_admin: false,
            },
            html_url: "https://github.com/octo/test",
            description: "Repository for DAZN Pact related things",
            fork: false,
            url: "https://api.github.com/repos/octo/test",
            forks_url: "https://api.github.com/repos/octo/test/forks",
            keys_url: "https://api.github.com/repos/octo/test/keys{/key_id}",
            collaborators_url:
                "https://api.github.com/repos/octo/test/collaborators{/collaborator}",
            teams_url: "https://api.github.com/repos/octo/test/teams",
            hooks_url: "https://api.github.com/repos/octo/test/hooks",
            issue_events_url:
                "https://api.github.com/repos/octo/test/issues/events{/number}",
            events_url: "https://api.github.com/repos/octo/test/events",
            assignees_url:
                "https://api.github.com/repos/octo/test/assignees{/user}",
            branches_url:
                "https://api.github.com/repos/octo/test/branches{/branch}",
            tags_url: "https://api.github.com/repos/octo/test/tags",
            blobs_url: "https://api.github.com/repos/octo/test/git/blobs{/sha}",
            git_tags_url:
                "https://api.github.com/repos/octo/test/git/tags{/sha}",
            git_refs_url:
                "https://api.github.com/repos/octo/test/git/refs{/sha}",
            trees_url: "https://api.github.com/repos/octo/test/git/trees{/sha}",
            statuses_url:
                "https://api.github.com/repos/octo/test/statuses/{sha}",
            languages_url: "https://api.github.com/repos/octo/test/languages",
            stargazers_url: "https://api.github.com/repos/octo/test/stargazers",
            contributors_url:
                "https://api.github.com/repos/octo/test/contributors",
            subscribers_url:
                "https://api.github.com/repos/octo/test/subscribers",
            subscription_url:
                "https://api.github.com/repos/octo/test/subscription",
            commits_url: "https://api.github.com/repos/octo/test/commits{/sha}",
            git_commits_url:
                "https://api.github.com/repos/octo/test/git/commits{/sha}",
            comments_url:
                "https://api.github.com/repos/octo/test/comments{/number}",
            issue_comment_url:
                "https://api.github.com/repos/octo/test/issues/comments{/number}",
            contents_url:
                "https://api.github.com/repos/octo/test/contents/{+path}",
            compare_url:
                "https://api.github.com/repos/octo/test/compare/{base}...{head}",
            merges_url: "https://api.github.com/repos/octo/test/merges",
            archive_url:
                "https://api.github.com/repos/octo/test/{archive_format}{/ref}",
            downloads_url: "https://api.github.com/repos/octo/test/downloads",
            issues_url:
                "https://api.github.com/repos/octo/test/issues{/number}",
            pulls_url: "https://api.github.com/repos/octo/test/pulls{/number}",
            milestones_url:
                "https://api.github.com/repos/octo/test/milestones{/number}",
            notifications_url:
                "https://api.github.com/repos/octo/test/notifications{?since,all,participating}",
            labels_url: "https://api.github.com/repos/octo/test/labels{/name}",
            releases_url:
                "https://api.github.com/repos/octo/test/releases{/id}",
            deployments_url:
                "https://api.github.com/repos/octo/test/deployments",
            created_at: "2019-01-25T16:22:27Z",
            updated_at: "2020-02-25T14:36:58Z",
            pushed_at: "2020-02-25T14:36:58Z",
            git_url: "git://github.com/octo/test.git",
            ssh_url: "git@github.com:octo/test.git",
            clone_url: "https://github.com/octo/test.git",
            svn_url: "https://github.com/octo/test",
            homepage: "https://test-broker.octo.indazn.com/",
            size: 361,
            stargazers_count: 2,
            watchers_count: 2,
            language: "HCL",
            has_issues: true,
            has_projects: true,
            has_downloads: true,
            has_wiki: true,
            has_pages: false,
            forks_count: 0,
            mirror_url: null,
            archived: false,
            disabled: false,
            open_issues_count: 10,
            license: null,
            forks: 0,
            open_issues: 10,
            watchers: 2,
            default_branch: "master",
        },
    },
    base: {
        label: "octo:master",
        ref: "master",
        sha: "dc0bab96fe7dddc6469ebe6f631c7d9eb6eb9127",
        user: {
            login: "octo",
            id: 21194695,
            node_id: "MDEyOk9yZ2FuaXphdGlvbjIxMTk0Njk1",
            avatar_url: "https://avatars2.githubusercontent.com/u/21194695?v=4",
            gravatar_id: "",
            url: "https://api.github.com/users/octo",
            html_url: "https://github.com/octo",
            followers_url: "https://api.github.com/users/octo/followers",
            following_url:
                "https://api.github.com/users/octo/following{/other_user}",
            gists_url: "https://api.github.com/users/octo/gists{/gist_id}",
            starred_url:
                "https://api.github.com/users/octo/starred{/owner}{/repo}",
            subscriptions_url:
                "https://api.github.com/users/octo/subscriptions",
            organizations_url: "https://api.github.com/users/octo/orgs",
            repos_url: "https://api.github.com/users/octo/repos",
            events_url: "https://api.github.com/users/octo/events{/privacy}",
            received_events_url:
                "https://api.github.com/users/octo/received_events",
            type: "Organization",
            site_admin: false,
        },
        repo: {
            id: 167577151,
            node_id: "MDEwOlJlcG9zaXRvcnkxNjc1NzcxNTE=",
            name: "test",
            full_name: "octo/test",
            private: true,
            owner: {
                login: "octo",
                id: 21194695,
                node_id: "MDEyOk9yZ2FuaXphdGlvbjIxMTk0Njk1",
                avatar_url:
                    "https://avatars2.githubusercontent.com/u/21194695?v=4",
                gravatar_id: "",
                url: "https://api.github.com/users/octo",
                html_url: "https://github.com/octo",
                followers_url: "https://api.github.com/users/octo/followers",
                following_url:
                    "https://api.github.com/users/octo/following{/other_user}",
                gists_url: "https://api.github.com/users/octo/gists{/gist_id}",
                starred_url:
                    "https://api.github.com/users/octo/starred{/owner}{/repo}",
                subscriptions_url:
                    "https://api.github.com/users/octo/subscriptions",
                organizations_url: "https://api.github.com/users/octo/orgs",
                repos_url: "https://api.github.com/users/octo/repos",
                events_url:
                    "https://api.github.com/users/octo/events{/privacy}",
                received_events_url:
                    "https://api.github.com/users/octo/received_events",
                type: "Organization",
                site_admin: false,
            },
            html_url: "https://github.com/octo/test",
            description: "Repository for DAZN Pact related things",
            fork: false,
            url: "https://api.github.com/repos/octo/test",
            forks_url: "https://api.github.com/repos/octo/test/forks",
            keys_url: "https://api.github.com/repos/octo/test/keys{/key_id}",
            collaborators_url:
                "https://api.github.com/repos/octo/test/collaborators{/collaborator}",
            teams_url: "https://api.github.com/repos/octo/test/teams",
            hooks_url: "https://api.github.com/repos/octo/test/hooks",
            issue_events_url:
                "https://api.github.com/repos/octo/test/issues/events{/number}",
            events_url: "https://api.github.com/repos/octo/test/events",
            assignees_url:
                "https://api.github.com/repos/octo/test/assignees{/user}",
            branches_url:
                "https://api.github.com/repos/octo/test/branches{/branch}",
            tags_url: "https://api.github.com/repos/octo/test/tags",
            blobs_url: "https://api.github.com/repos/octo/test/git/blobs{/sha}",
            git_tags_url:
                "https://api.github.com/repos/octo/test/git/tags{/sha}",
            git_refs_url:
                "https://api.github.com/repos/octo/test/git/refs{/sha}",
            trees_url: "https://api.github.com/repos/octo/test/git/trees{/sha}",
            statuses_url:
                "https://api.github.com/repos/octo/test/statuses/{sha}",
            languages_url: "https://api.github.com/repos/octo/test/languages",
            stargazers_url: "https://api.github.com/repos/octo/test/stargazers",
            contributors_url:
                "https://api.github.com/repos/octo/test/contributors",
            subscribers_url:
                "https://api.github.com/repos/octo/test/subscribers",
            subscription_url:
                "https://api.github.com/repos/octo/test/subscription",
            commits_url: "https://api.github.com/repos/octo/test/commits{/sha}",
            git_commits_url:
                "https://api.github.com/repos/octo/test/git/commits{/sha}",
            comments_url:
                "https://api.github.com/repos/octo/test/comments{/number}",
            issue_comment_url:
                "https://api.github.com/repos/octo/test/issues/comments{/number}",
            contents_url:
                "https://api.github.com/repos/octo/test/contents/{+path}",
            compare_url:
                "https://api.github.com/repos/octo/test/compare/{base}...{head}",
            merges_url: "https://api.github.com/repos/octo/test/merges",
            archive_url:
                "https://api.github.com/repos/octo/test/{archive_format}{/ref}",
            downloads_url: "https://api.github.com/repos/octo/test/downloads",
            issues_url:
                "https://api.github.com/repos/octo/test/issues{/number}",
            pulls_url: "https://api.github.com/repos/octo/test/pulls{/number}",
            milestones_url:
                "https://api.github.com/repos/octo/test/milestones{/number}",
            notifications_url:
                "https://api.github.com/repos/octo/test/notifications{?since,all,participating}",
            labels_url: "https://api.github.com/repos/octo/test/labels{/name}",
            releases_url:
                "https://api.github.com/repos/octo/test/releases{/id}",
            deployments_url:
                "https://api.github.com/repos/octo/test/deployments",
            created_at: "2019-01-25T16:22:27Z",
            updated_at: "2020-02-25T14:36:58Z",
            pushed_at: "2020-02-25T14:36:58Z",
            git_url: "git://github.com/octo/test.git",
            ssh_url: "git@github.com:octo/test.git",
            clone_url: "https://github.com/octo/test.git",
            svn_url: "https://github.com/octo/test",
            homepage: "https://test-broker.octo.indazn.com/",
            size: 361,
            stargazers_count: 2,
            watchers_count: 2,
            language: "HCL",
            has_issues: true,
            has_projects: true,
            has_downloads: true,
            has_wiki: true,
            has_pages: false,
            forks_count: 0,
            mirror_url: null,
            archived: false,
            disabled: false,
            open_issues_count: 10,
            license: null,
            forks: 0,
            open_issues: 10,
            watchers: 2,
            default_branch: "master",
        },
    },
    _links: {
        self: {
            href: "https://api.github.com/repos/octo/test/pulls/43",
        },
        html: {
            href: "https://github.com/octo/test/pull/43",
        },
        issue: {
            href: "https://api.github.com/repos/octo/test/issues/43",
        },
        comments: {
            href: "https://api.github.com/repos/octo/test/issues/43/comments",
        },
        review_comments: {
            href: "https://api.github.com/repos/octo/test/pulls/43/comments",
        },
        review_comment: {
            href:
                "https://api.github.com/repos/octo/test/pulls/comments{/number}",
        },
        commits: {
            href: "https://api.github.com/repos/octo/test/pulls/43/commits",
        },
        statuses: {
            href:
                "https://api.github.com/repos/octo/test/statuses/168c42f4cda8933fbe5ce728c7bb34289fa08304",
        },
    },
    author_association: "CONTRIBUTOR",
};
