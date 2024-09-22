import { TSystemField } from "../models/system/system";
import axiosInstance from "./axiosClients";

const organizationApi = {
    createOrganization: (data: TSystemField) => {
        const url = "/organizations";
        return axiosInstance.post(url, data);
    },
    getListOrganization: (params?: {
        pageIndex?: number;
        pageSize?: number;
    }) => {
        const url = "/organizations";
        return axiosInstance.get(url, { params });
    },
    updateOrganization: (data: TSystemField) => {
        const url = "/organizations";
        return axiosInstance.put(url, data);
    },
    deleteOrganization: (id: string) => {
        const url = `/organizations?id=${id}`;
        return axiosInstance.delete(url);
    },
};

export default organizationApi;
