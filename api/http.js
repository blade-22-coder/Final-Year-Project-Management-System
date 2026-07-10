const BASE_URL = "http://localhost:8080/api";

export async function request(endpoint, options = {}) {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            ...(options.body instanceof FormData ? {} : {  "Content-Type": "application/json"}),
            ...(token && { "Authorization": `Bearer ${token}` }),
            ...(options.headers || {})            
        }
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed (${res.status})`);
    }

    const text = await res.text();
    return text ? JSON.parse(text): null;
}
