import axios, {AxiosRequestHeaders} from "axios";
import {getCookie} from "cookies-next";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "https://hound-back.onrender.com";
console.log("Server URL", serverUrl);

const authApi = axios.create({
    baseURL: serverUrl,
    withCredentials: true
});

authApi.interceptors.request.use((config) => {
    const token = getCookie("jwt");
    config.headers = {
        Authorization: `Bearer ${token}`
    } as AxiosRequestHeaders;
    return config;
});

export default authApi;
