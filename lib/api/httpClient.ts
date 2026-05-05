import { AxiosResponse } from "axios";

export type RequestBody = unknown;
export type RequestHeaders = Record<string, string> | undefined;

export interface HttpClient {
    get<T>(url: string): Promise<T>;
    post<T>(url: string, data?: RequestBody): Promise<T>;
    patch<T>(url: string, data?: RequestBody): Promise<T>;
    put<T>(
        url: string,
        data?: RequestBody,
        headers?: RequestHeaders
    ): Promise<AxiosResponse<T>>;
    delete<T>(url: string, data?: RequestBody): Promise<T>;
}
