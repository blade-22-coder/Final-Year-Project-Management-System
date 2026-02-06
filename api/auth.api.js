import { request } from ".http.js";

export function login(data) {
    return request("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
}