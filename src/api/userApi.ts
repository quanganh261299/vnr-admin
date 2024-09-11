import { TSystemUser } from "../models/user/user";
import axiosInstance from "./axiosClients";

const userApi = {
    getRole: () => {
        const url = "/Role";
        return axiosInstance.get(url);
    },
    getListUser: (pageIndex?: number, pageSize?: number) => {
        const url = `/users?pageIndex=${pageIndex || ""}&pageSize=${pageSize}`;
        return axiosInstance.get(url);
    },
    createUser: (data: TSystemUser) => {
        const url = "/users";
        return axiosInstance.post(url, data);
    },
};

export default userApi;
