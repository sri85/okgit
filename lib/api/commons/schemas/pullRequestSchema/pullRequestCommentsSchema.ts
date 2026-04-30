import Joi from "@hapi/joi";

function pullRequestCommentsSchema() {
    return Joi.array().items(
        Joi.object({
            user: Joi.object()
                .allow(null)
                .required(),
            body: Joi.string().required(),
            html_url: Joi.string().required(),
        }).unknown()
    );
}

export { pullRequestCommentsSchema };
