import Joi from "@hapi/joi";

function issueSchema() {
    return Joi.object({
        html_url: Joi.string().required(),
        user: Joi.object().required(),
        state: Joi.string().required(),
        assignees: Joi.array().required(),
    }).unknown();
}

export { issueSchema };
