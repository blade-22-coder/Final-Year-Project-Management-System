const BASE_URL = "http://localhost:8080/api";

export async function request(endpoint, options = {}) {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}${endpoint}`, {
        "Authorization": token ? `Bearer ${token}` : "",
        ...options.headers
    },
    ...options.headers
)};

if (!res.ok) {
    throw new Error(await res.text());
}

return res.json();