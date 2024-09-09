import { LoginType } from "../models/common";
import axiosInstance from "./axiosClients";

const authApi = {
    login: (data: LoginType) => {
        const url = "/auth/login";
        return axiosInstance.post(url, data);
    },
};

export default authApi;
