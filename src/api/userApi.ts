import { TBmUserField, TSystemUser } from "../models/user/user";
import axiosInstance from "./axiosClients";

const userApi = {
    getRole: () => {
        const url = "/Role";
        return axiosInstance.get(url);
    },
    getListSystemUser: (pageIndex?: number, pageSize?: number) => {
        const url = `/users/system?pageIndex=${
            pageIndex || ""
        }&pageSize=${pageSize}`;
        return axiosInstance.get(url);
    },
    getListBmUser: (pageIndex?: number, pageSize?: number) => {
        const url = `/users/bm?pageIndex=${pageIndex || ""}&pageSize=${
            pageSize || ""
        }`;
        return axiosInstance.get(url);
    },
    createBmUser: (data: TBmUserField) => {
        const url = "/users/bm";
        return axiosInstance.post(url, data);
    },
    createSystemUser: (data: TSystemUser) => {
        const url = "/users";
        return axiosInstance.post(url, data);
    },
    deleteUser: (id: string) => {
        const url = `/users/${id}`;
        return axiosInstance.delete(url);
    },
};

export default userApi;
