const SECRET = import.meta.env.VITE_AUTH_SECRET || "archiflow-dev-secret-change-in-production";
function hexToBytes(hex) {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
    }
    return bytes;
}
async function getHmacKey() {
    const encoder = new TextEncoder();
    return crypto.subtle.importKey("raw", encoder.encode(SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
}
function decodeBase64Url(token) {
    const base64 = token.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    return atob(padded);
}
export async function verifySessionEdge(token) {
    try {
        const parsed = JSON.parse(decodeBase64Url(token));
        const key = await getHmacKey();
        const encoder = new TextEncoder();
        const valid = await crypto.subtle.verify("HMAC", key, new Uint8Array(hexToBytes(parsed.sig)), encoder.encode(parsed.data));
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
