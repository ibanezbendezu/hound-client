import axios from "../lib/axios"
import {jwtVerify} from "jose";
import {cookies} from "next/headers";
import {setCookie, deleteCookie, getCookie} from "cookies-next";

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
    const token = localStorage.getItem("jwt");
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

export async function refreshSession() {
    const accessToken = cookies().get("jwt")?.value;

    const refreshResponse = await fetch(`${process.env.SERVER_URL}/auth/github/refresh`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    console.log("REFRESH RESPONSE:", refreshResponse.status);

    if (refreshResponse.ok) {
        console.log("OLD TOKEN:", accessToken);
        console.log("REFRESH RESPONSE:", refreshResponse);
        const {accessToken: newAccessToken} = await refreshResponse.json();
        setCookie("jwt", newAccessToken, {
            maxAge: 60 * 60 * 24 * 7
        });
        return newAccessToken;
    } else {
        deleteCookie("jwt");
        return null;
    }
}
