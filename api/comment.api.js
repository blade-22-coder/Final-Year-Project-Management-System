import { request } from  "./http.js";

export function getComments() {
    return request("/student/comments/me");
}

export function sendReply(section, message) {
    return request("/student/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, message})
    });
}