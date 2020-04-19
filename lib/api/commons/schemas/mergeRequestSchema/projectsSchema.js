import Joi from "@hapi/joi";

function projectsSchema() {
    return Joi.object({
        name: Joi.string().required(),
        id: Joi.number().required(),
    }).unknown();
}

export { projectsSchema };
