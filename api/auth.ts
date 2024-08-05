import axios from "../lib/axios"
import {jwtVerify} from "jose";
import {cookies} from "next/headers";
import {setCookie, deleteCookie} from "cookies-next";

const secretKey = process.env.JWT_SECRET;
const key = new TextEncoder().encode(secretKey);

/**
 * Desencripta un token JWT
 * @param input
 * @returns {Promise<any>}
 */
export async function decrypt(input: string): Promise<any> {
    const {payload} = await jwtVerify(input, key, {
        algorithms: ["HS256"],
    });
    return payload;
}

/**
 * Verifica si la sesión ha expirado
 * @param session
 * @returns {Promise<boolean>}
 */
export async function isSessionExpired(session: any): Promise<boolean> {
    const currentTime = Math.floor(Date.now() / 1000);
    if (!session) return true;
    return session.exp < currentTime;
}

/**
 * Obtiene la sesión actual
 * @returns {Promise<any>}
 */
export async function getSession(): Promise<any> {
    const token = cookies().get("jwt")?.value;
    if (!token) return null;
    try {
        const session = await decrypt(token);
        const expired = await isSessionExpired(session);
        if (expired) {
            console.log("Session has expired.");
            return null;
        }
        return session;
    } catch (error: any) {
        if (error.name === "JWTExpired") {
            console.log("JWT has expired.");
        } else {
            console.error("An error occurred:", error);
        }
        return null;
    }
}

export async function refresh() {
    const token = getAccessToken();
    setCookie("jwt", token, {
        maxAge: 3600,
    });
    return token;
}

export async function logout() {
    deleteCookie("jwt");
}

export async function profile() {
    return await axios.get("/profile");
}

async function getAccessToken() {
    try {
        const response = await fetch("/auth/github/refresh");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const accessToken = data.access_token;
        console.log(accessToken);
        return accessToken;
    } catch (error) {
        console.error('Error fetching access token:', error);
    }
}
