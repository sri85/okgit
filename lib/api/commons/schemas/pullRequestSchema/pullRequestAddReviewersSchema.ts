import Joi from "@hapi/joi";

function pullRequestAddReviewersSchema() {
    return Joi.object({
        requested_reviewers: Joi.array().required(),
    }).unknown();
}

export { pullRequestAddReviewersSchema };
