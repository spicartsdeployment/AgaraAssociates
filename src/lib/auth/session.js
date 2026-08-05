export const SESSION_COOKIE = "archiflow_session";
export { verifySessionEdge as verifySession } from "./session-edge";
const SECRET = import.meta.env.VITE_AUTH_SECRET || "archiflow-dev-secret-change-in-production";
function encodeBase64Url(value) {
    return btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function decodeBase64Url(value) {
    const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    return atob(padded);
}
function hexToBytes(hex) {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
    }
    return bytes;
}
function bytesToHex(bytes) {
    return Array.from(new Uint8Array(bytes))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
}
async function signData(data) {
    const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
    return bytesToHex(signature);
}
export async function signSession(payload) {
    const exp = Date.now() + 7 * 24 * 60 * 60 * 1000;
    const data = JSON.stringify({ ...payload, exp });
    const sig = await signData(data);
    return encodeBase64Url(JSON.stringify({ data, sig }));
}
export function getSessionTokenFromCookie() {
    if (typeof document === "undefined")
        return null;
    const match = document.cookie.match(new RegExp(`(?:^|; )${SESSION_COOKIE}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
}
export function setSessionCookie(token) {
    const maxAge = 7 * 24 * 60 * 60;
    const secure = import.meta.env.PROD ? "; Secure" : "";
    document.cookie = `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}
export function clearSessionCookie() {
    document.cookie = `${SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}
export async function getSession() {
    const token = getSessionTokenFromCookie();
    if (!token)
        return null;
    try {
        const parsed = JSON.parse(decodeBase64Url(token));
        const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
        const valid = await crypto.subtle.verify("HMAC", key, new Uint8Array(hexToBytes(parsed.sig)), new TextEncoder().encode(parsed.data));
        if (!valid)
            return null;
        const payload = JSON.parse(parsed.data);
        if (payload.exp < Date.now())
            return null;
        return payload;
    }
    catch {
        return null;
    }
}
