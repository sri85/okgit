import Joi from "@hapi/joi";

function pullRequestFilesSchema() {
    return Joi.array().items(
        Joi.object({
            filename: Joi.string().required(),
            status: Joi.string().required(),
            additions: Joi.number().required(),
            deletions: Joi.number().required(),
            changes: Joi.number().required(),
        }).unknown()
    );
}

export { pullRequestFilesSchema };
