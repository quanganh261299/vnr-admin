import axios from "axios";
import { clearAuthStatusBm } from "../helper/authStatus";

const baseUrl = import.meta.env.VITE_BASE_URL;
const axiosBmInstance = axios.create({
    baseURL: baseUrl,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

axiosBmInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("BmToken");
        if (token) config.headers.Authorization = `Bearer ${token}`;

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosBmInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response.status === 401) {
            clearAuthStatusBm();
            window.location.href = "/loginBM";
        }
        return Promise.reject(error);
    }
);

export default axiosBmInstance;
