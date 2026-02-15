import { request } from "./http.js";

export function getDeadlines() {
    return request("/deadlines");
}