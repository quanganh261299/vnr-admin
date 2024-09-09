import { LoginType } from "../models/common";
import axiosInstance from "./axiosClients";

const authApi = {
    login: (data: LoginType) => {
        const url = "/auth/login";
        return axiosInstance.post(url, data);
    },
    loginFB: (accessToken: string) => {
        const url = `/auth/facebook?accessToken=${accessToken}`;
        return axiosInstance.get(url);
    },
};

export default authApi;
