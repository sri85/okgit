import Joi from "@hapi/joi";

function pullrequestUpdateSchema() {
    return Joi.object({
        state: Joi.string().required(),
    }).unknown();
}
export { pullrequestUpdateSchema };
