import axios from "../lib/axios"
import {deleteCookie} from "cookies-next";

export async function profile() {
    return await axios.get("/profile");
}

export async function logout() {
    deleteCookie("jwt");
    deleteCookie("user");
}
