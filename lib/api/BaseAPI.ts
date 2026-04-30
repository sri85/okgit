import axios, { AxiosError, AxiosResponse } from "axios";
import { token } from "../configManager/parseConfig";

type RequestBody = object | string[] | string | number | undefined;
type RequestHeaders = Record<string, string> | undefined;

/**
 * @class API Factory
 */
export class BaseAPI {
    private readonly baseURL: string;
    private readonly timeout: number;
    private readonly headers: Record<string, string>;

    /**
     * Creates an instance.
     * @param {string}baseURL
     * @param {number}timeout
     */
    constructor(baseURL: string, timeout = 5000) {
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

    async getRequest<T>(url: string): Promise<T> {
        const requestInstance = this.createRequestObject();
        const responseObject: AxiosResponse<T> = await requestInstance
            .get<T>(url)
            .catch((err: AxiosError) => {
                return Promise.reject(err.response);
            });
        return responseObject.data;
    }
    async patchRequest<T>(url: string, data: RequestBody): Promise<T> {
        const requestInstance = this.createRequestObject();
        const responseObject: AxiosResponse<T> = await requestInstance
            .patch<T>(url, data)
            .catch((err: AxiosError) => {
                return Promise.reject(err.response);
            });
        return responseObject.data;
    }
    async postRequest<T>(url: string, data: RequestBody): Promise<T> {
        const requestInstance = this.createRequestObject();
        const responseObject: AxiosResponse<T> = await requestInstance
            .post<T>(url, data)
            .catch((err: AxiosError) => {
                return Promise.reject(err.response);
            });
        return responseObject.data;
    }

    async deleteRequest<T>(url: string, data?: RequestBody): Promise<T> {
        const requestInstance = this.createRequestObject();
        const responseObject: AxiosResponse<T> = await requestInstance
            .delete<T>(url, { data })
            .catch((err: AxiosError) => {
                return Promise.reject(err.response);
            });
        return responseObject.data;
    }

    async putRequest<T>(
        url: string,
        data?: RequestBody,
        headers?: RequestHeaders
    ): Promise<AxiosResponse<T>> {
        const requestInstance = this.createRequestObject();
        const responseObject: AxiosResponse<T> = await requestInstance
            .put<T>(url, { data }, { headers })
            .catch((err: AxiosError) => {
                return Promise.reject(err.response);
            });
        return responseObject;
    }

    protected getStatusCode(err: unknown): number | undefined {
        if (
            typeof err === "object" &&
            err !== null &&
            "status" in err &&
            typeof err.status === "number"
        ) {
            return err.status;
        }
        return undefined;
    }

    protected getResponseStatus(response: AxiosResponse<unknown> | undefined) {
        return response === undefined ? undefined : response.status;
    }

    protected getResponseData<T>(response: AxiosResponse<T>): T {
        return response.data;
    }
}
