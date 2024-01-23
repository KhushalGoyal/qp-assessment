import axios, { AxiosResponse } from "axios";

export default class RequestHelper {
    async get(baseURL: string,
        endpoint?: string,
        params?: { [key: string]: any },
        headers?: { [key: string]: any }): Promise<AxiosResponse> {
        const url = endpoint ? baseURL.concat(endpoint) : baseURL;
        const options = { params, headers };
        return axios.get(url, options);
    }
}