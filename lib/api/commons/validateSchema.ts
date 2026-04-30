import Joi from "@hapi/joi";

export default function validateSchema<T>(
    response: unknown,
    schema: Joi.Schema
): response is T {
    let isValidResponse = false;
    const { error } = schema.validate(response);
    if (error === undefined) {
        isValidResponse = true;
    }
    return isValidResponse;
}
