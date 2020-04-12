const axios = require("axios").default;
import { token } from "../configManager/parseConfig";

/**
 * @class API Factory
 */
export class BaseAPI {
    /**
     * Creates an instance.
     * @param {string}baseURL
     * @param {number}timeout
     */
    constructor(baseURL, timeout = 5000) {
        this.baseURL = baseURL;
        this.timeout = timeout;
        this.headers = { Authorization: `token ${token}` };
    }
    createRequestObject() {
        return axios.create({
            baseURL: this.baseURL,
            timeout: this.timeout,
            headers: this.headers,
        });
    }

    async getRequest(url) {
        const requestInstance = this.createRequestObject();
        let responseObject;
        responseObject = await requestInstance.get(url).catch(err => {
            return Promise.reject(err);
        });
        return responseObject["data"];
    }
    async patchRequest(url, data) {
        const requestInstance = this.createRequestObject();
        let responseObject;

        responseObject = await requestInstance.patch(url, data).catch(err => {
            return Promise.reject(err);
        });
        return responseObject["data"];
    }
    async postRequest(url, data) {
        const requestInstance = this.createRequestObject();
        let responseObject;
        responseObject = await requestInstance.post(url, data).catch(err => {
            console.log(`Error ${err}`);
            return Promise.reject(err);
        });
        return responseObject["data"];
    }

    async deleteRequest(url, data) {
        const requestInstance = this.createRequestObject();
        let responseObject;
        responseObject = await requestInstance
            .delete(url, { data })
            .catch(err => {
                console.error(`DELETE ERROR ${err}`);
                return Promise.reject(err);
            });
        return responseObject["data"];
    }

    async putRequest(url, data, headers) {
        const requestInstance = this.createRequestObject();
        let responseObject;

        responseObject = await requestInstance
            .put(url, { data }, { headers })
            .catch(err => {
                console.error(`PUT ERROR ${err}`);
                return Promise.reject(err);
            });
        return responseObject;
    }
}
