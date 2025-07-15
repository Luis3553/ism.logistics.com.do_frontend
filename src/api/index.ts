import axios from "axios";

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

const params = new URLSearchParams(window.location.search);
// const sessionHash = params.get("session_key") || "b4f630467814a4b58892f04cf4d8c526";
const sessionHash = params.get("session_key") || "cf229226a28d0bc8a646d34b7fa86377";
// const sessionHash = params.get("session_key") || "3d152bad53ff3e5ae928af1475fa2d4c";
instance.defaults.headers.common["X-Hash-Token"] = sessionHash;

export default instance;
