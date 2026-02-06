import { request } from "./http.js";

export function uploadSubmission(type, file) {
    const form = new FormData();
    form.append("type", type);
    form.append("file", file);

    return request("/submissions", {
        method: "POST",
        body: form
    });
}

export function getMySubmissions() {
    return request("/submissions/student/me");
}