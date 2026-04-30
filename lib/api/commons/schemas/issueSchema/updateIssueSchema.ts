import Joi from "@hapi/joi";

function updateIssueSchema() {
    return Joi.object({
        html_url: Joi.string().required(),
    }).unknown();
}

export { updateIssueSchema };
