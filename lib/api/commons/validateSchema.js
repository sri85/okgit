export default function validateSchema(response, schema) {
    let isValidResponse = false;
    const { error } = schema.validate(response);
    if (error === undefined) {
        isValidResponse = true;
    }
    return isValidResponse;
}
