import { request } from ".https.js";

export function getDeadlines() {
    return request("/deadlines");
}