const BASE = import.meta.env.VITE_API_URL ?? "";
export async function apiGet(path) {
    const res = await fetch(`${BASE}${path}`, { cache: "no-store" });
    if (!res.ok)
        throw new Error(`API error: ${res.status}`);
    const json = await res.json();
    return json.data;
}
