import axios, {AxiosRequestHeaders} from "axios";
import {getCookie} from "cookies-next";

const authApi = axios.create({
    baseURL: "http://localhost:5000/",
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