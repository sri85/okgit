import Joi from "@hapi/joi";

function pullRequestCommitsSchema() {
    return Joi.array().items(
        Joi.object({
            commit: Joi.object().required(),
            html_url: Joi.string().required(),
        }).unknown()
    );
}

export { pullRequestCommitsSchema };
