
import { cookies } from 'next/headers';

const TOKEN_NAME = "auth-token";
const REFRESH_TOKEN_NAME = "auth-refresh-token";
const DOMAIN = '.nour.com';
export function getToken() {
    const authToken = cookies().get(TOKEN_NAME)
    return authToken?.value 
}

export function getRefreshToken() {
    const authToken = cookies().get(REFRESH_TOKEN_NAME)
    return authToken?.value 
}
export function setToken(authToken) {
    return cookies().set({
        name: TOKEN_NAME,
        value: authToken,
        httpOnly: true,
        maxAge: 3600 * 24 * 30, // 30 days
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development",
        domain: DOMAIN,
    });
}

export function setRefreshToken(refreshToken) {
    return cookies().set({
        name: REFRESH_TOKEN_NAME,
        value: refreshToken,
        httpOnly: true,
        maxAge: 3600 * 24 * 30, // 30 days
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development",
        domain: DOMAIN,
    });
}

export function deleteTokens() {
    cookies().delete(REFRESH_TOKEN_NAME)
    return cookies().delete(TOKEN_NAME)
}