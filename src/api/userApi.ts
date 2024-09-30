import { TBmUserField, TSystemUser } from "../models/user/user";
import axiosInstance from "./axiosClients";

const userApi = {
    getRole: () => {
        const url = "/Role";
        return axiosInstance.get(url);
    },
    getListSystemUser: (params?: {
        pageIndex?: number;
        pageSize?: number;
        roleId?: string;
    }) => {
        const url = "/users/system";
        return axiosInstance.get(url, { params });
    },
    createSystemUser: (data: TSystemUser) => {
        const url = "/users";
        return axiosInstance.post(url, data);
    },
    updateSystemUser: (data: TSystemUser) => {
        const url = "/users/system";
        return axiosInstance.put(url, data);
    },
    getListBmUser: (params?: {
        pageIndex?: number;
        pageSize?: number;
        organizationId?: string;
        branchId?: string;
        groupId?: string;
    }) => {
        const url = "/users/bm";
        return axiosInstance.get(url, { params });
    },
    createBmUser: (data: TBmUserField) => {
        const url = "/users/bm";
        return axiosInstance.post(url, data);
    },
    updateBmUser: (data: TBmUserField) => {
        const url = "/users";
        return axiosInstance.put(url, data);
    },
    deleteUser: (id: string) => {
        const url = `/users/${id}`;
        return axiosInstance.delete(url);
    },
};

export default userApi;
