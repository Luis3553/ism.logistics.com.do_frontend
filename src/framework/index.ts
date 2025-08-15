import axios from "axios";

const instance = axios.create({
    baseURL: "https://app.progps.com.do/api-v2/",
});

const params = new URLSearchParams(window.location.search);
// const sessionHash = params.get("session_key") || "b4f630467814a4b58892f04cf4d8c526"; // URBALUZ
// const sessionHash = params.get("session_key") || "cf229226a28d0bc8a646d34b7fa86377"; // ISM
// const sessionHash = params.get("session_key") || "db59f1b755077bc9017368b1f337da5c"; // SOLFRESH
const sessionHash = params.get("session_key") || "3d152bad53ff3e5ae928af1475fa2d4c"; // RUTAS

instance.interceptors.request.use((config) => {
    // Always inject hash for requests with a body
    if (config.data && typeof config.data === "object" && config.data !== null) {
        if (config.data instanceof FormData) {
            config.data.append("hash", sessionHash);
        } else {
            config.data = { ...config.data, hash: sessionHash };
        }
    }
    return config;
});

export default instance;
