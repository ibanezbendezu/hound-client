import axios, {AxiosRequestHeaders} from "axios";
import {getCookie} from "cookies-next";

const authApi = axios.create({
    baseURL: "https://hound-back.onrender.com/",
    withCredentials: true
});

authApi.interceptors.request.use((config) => {
    const token = localStorage.getItem("jwt");
    console.log("Fetch token", token);
    config.headers = {
        Authorization: `Bearer ${token}`
    } as AxiosRequestHeaders;
    return config;
});

export default authApi;
