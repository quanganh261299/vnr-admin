import { TAgencyField } from "../models/agency/agency";
import axiosInstance from "./axiosClients";

const branchApi = {
    createBranch: (data: TAgencyField) => {
        const url = "/branches";
        return axiosInstance.post(url, data);
    },
    getListBranch: (params?: {
        pageIndex?: number;
        pageSize?: number;
        organizationId?: string;
    }) => {
        const url = `/branches`;
        return axiosInstance.get(url, { params });
    },
    updateBranch: (data: TAgencyField) => {
        const url = "/branches";
        return axiosInstance.put(url, data);
    },
    deleteBranch: (id: string) => {
        const url = `/branches?id=${id}`;
        return axiosInstance.delete(url);
    },
};

export default branchApi;
