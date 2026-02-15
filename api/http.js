const BASE_URL = "http://localhost:8080/api";

export async function request(endpoint, options = {}) {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token && { "Authorization": `Bearer ${token}` }),
            ...(options.headers || {})
        }
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
    }

    return res.json();
}
