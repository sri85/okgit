export const pullrequestFilesMocks = [
    {
        sha: "09a44804e31f0b0d0e54e789bf83cf0eedeb7e2d",
        filename: "README.md",
        status: "modified",
        additions: 1,
        deletions: 0,
        changes: 1,
        blob_url:
            "https://github.com/getndazn/dapact/blob/168c42f4cda8933fbe5ce728c7bb34289fa08304/README.md",
        raw_url:
            "https://github.com/getndazn/dapact/raw/168c42f4cda8933fbe5ce728c7bb34289fa08304/README.md",
        contents_url:
            "https://api.github.com/repos/getndazn/dapact/contents/README.md?ref=168c42f4cda8933fbe5ce728c7bb34289fa08304",
        patch:
            "@@ -59,4 +59,5 @@ To prevent those dangers, our service does the following:\n * Tries to find the latest successful build available for that repo in master (work will be done to enable it to find the production build too).\n * Triggers a deployment event ``pact`` in the target repo. This is why it is really important that the target repo's team understands that enabling it means they have to prepare their pipeline to do it.\n \n+\n **More information about this will be available in the RFC.**",
    },
];
