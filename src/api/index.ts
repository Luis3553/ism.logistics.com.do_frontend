import axios from "axios";

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

const params = new URLSearchParams(window.location.search);
// const sessionHash = params.get("session_key") || "b4f630467814a4b58892f04cf4d8c526";
const sessionHash = params.get("session_key") || "cf229226a28d0bc8a646d34b7fa86377";
instance.defaults.headers.common["X-Hash-Token"] = sessionHash;

export default instance;
