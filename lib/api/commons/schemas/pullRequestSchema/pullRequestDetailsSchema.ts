import Joi from "@hapi/joi";

function pullRequestDetailsSchema() {
    return Joi.object({
        merged: Joi.boolean().required(),
        additions: Joi.number().required(),
        deletions: Joi.number().required(),
        changed_files: Joi.number().required(),
        mergeable_state: Joi.string().required(),
        commits: Joi.number().required(),
        comments: Joi.number().required(),
        review_comments: Joi.number().required(),
    }).unknown();
}

export { pullRequestDetailsSchema };
