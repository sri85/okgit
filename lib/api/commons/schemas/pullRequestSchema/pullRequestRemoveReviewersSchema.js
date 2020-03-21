import Joi from "@hapi/joi";

function pullRequestRemoveReviewersSchema() {
    return Joi.object({
        requested_reviewers: Joi.array().required(),
    }).unknown();
}

export { pullRequestRemoveReviewersSchema };
