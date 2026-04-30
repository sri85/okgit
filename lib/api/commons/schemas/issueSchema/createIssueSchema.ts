import Joi from "@hapi/joi";

function createIssueSchema() {
    return Joi.object({
        html_url: Joi.string().required(),
    }).unknown();
}

export { createIssueSchema };
