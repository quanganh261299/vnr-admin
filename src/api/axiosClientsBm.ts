import axios from "axios";
import { clearAuthStatus } from "../helper/authStatus";

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
            clearAuthStatus();
            window.location.href = "/loginBM";
        }
        return Promise.reject(error);
    }
);

// axiosInstance.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         const originalConfig = error.config;

//         if (
//             error?.response?.request?.responseURL?.includes("/refresh") ||
//             error?.response?.request?.responseURL?.includes("/login")
//         )
//             return;

//         if (error?.response?.status === 401 && !originalConfig._retry) {
//             originalConfig._retry = true;
//             try {
//                 const refreshToken = localStorage.getItem("refreshToken");
//                 localStorage.setItem("token", refreshToken || "");
//                 originalConfig.headers.Authorization = `Bearer ${refreshToken}`;
//                 if (refreshToken) {
//                     const refreshResponse = await axiosInstance.post(
//                         "auth/refresh"
//                     );
//                     if (!refreshResponse) window.location.href = "/login";
//                     const newToken = refreshResponse.data.token;
//                     const newRefreshToken = refreshResponse.data.refreshToken;
//                     localStorage.setItem("token", newToken);
//                     localStorage.setItem("refreshToken", newRefreshToken);

//                     originalConfig.headers.Authorization = `Bearer ${newToken}`;
//                     if (originalConfig.url === "/files/upload") {
//                         originalConfig.headers = {
//                             "Content-Type": "multipart/form-data",
//                         };
//                     }
//                     return axiosInstance(originalConfig);
//                 } else {
//                     window.location.href = "/login";
//                 }
//                 // eslint-disable-next-line @typescript-eslint/no-unused-vars
//             } catch (refreshError) {
//                 // window.location.href = '/login'
//             }
//         }

//         if (error?.response?.status === 429) {
//             await new Promise((resolve) => setTimeout(resolve, 100000));

//             return axiosInstance(originalConfig);
//         }

//         return Promise.reject(error);
//     }
// );

export default axiosBmInstance;
