import Joi from "@hapi/joi";

function pullrequestListSchema() {
    return Joi.array().items(
        Joi.object({
            html_url: Joi.string().required(),
            created_at: Joi.string().required(),
            user: Joi.object().required(),
        }).unknown()
    );
}

export { pullrequestListSchema };
