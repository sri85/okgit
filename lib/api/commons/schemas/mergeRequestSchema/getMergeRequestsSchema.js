import Joi from "@hapi/joi";

function getMergeRequestsSchema() {
    return Joi.object({
        web_url: Joi.string().required(),
        created_at: Joi.string().required(),
        author: Joi.object().required(),
        state: Joi.string().required(),
    }).unknown();
}

export { getMergeRequestsSchema };
