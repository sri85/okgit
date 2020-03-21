import Joi from "@hapi/joi";

function listIssuesSchema() {
    return Joi.array().items(
        Joi.object({
            html_url: Joi.string().required(),
            user: Joi.object().required(),
            state: Joi.string().required(),
            assignees: Joi.array().required(),
        }).unknown()
    );
}

export { listIssuesSchema };
