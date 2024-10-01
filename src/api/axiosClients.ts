import axios from "axios";
import { clearAuthStatus } from "../helper/authStatus";

const baseUrl = import.meta.env.VITE_BASE_URL;
const axiosInstance = axios.create({
    baseURL: baseUrl,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) config.headers.Authorization = `Bearer ${token}`;

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response.status === 401) {
            clearAuthStatus();
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
