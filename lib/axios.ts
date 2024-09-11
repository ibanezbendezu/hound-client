import axios, {AxiosRequestHeaders} from "axios";
import {getCookie} from "cookies-next";

const githubAuthUrl = process.env.SERVER_URL as string || "http://localhost:5000/";

const authApi = axios.create({
    baseURL: githubAuthUrl,
    withCredentials: true
});

authApi.interceptors.request.use((config) => {
    const token = getCookie("jwt");
    console.log("Fetch token", token);
    config.headers = {
        Authorization: `Bearer ${token}`
    } as AxiosRequestHeaders;
    return config;
});

export default authApi;
