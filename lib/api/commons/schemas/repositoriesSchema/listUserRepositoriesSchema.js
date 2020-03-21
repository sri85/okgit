import Joi from "@hapi/joi";

function listUserRepositoriesSchema() {
    return Joi.object({
        full_name: Joi.string().required(),
        html_url: Joi.string().required(),
        ssh_url: Joi.string().required(),
        forks: Joi.number().required(),
        open_issues: Joi.number().required(),
        stargazers_count: Joi.number().required(),
        subscribers_count: Joi.number().required(),
    }).unknown();
}

export { listUserRepositoriesSchema };
