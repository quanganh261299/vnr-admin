import { TAgencyField } from "../models/agency/agency";
import axiosInstance from "./axiosClients";

const branchApi = {
    createBranch: (data: TAgencyField) => {
        const url = "/branches";
        return axiosInstance.post(url, data);
    },
    getListBranch: (
        pageIndex?: number,
        pageSize?: number,
        organizationId?: string
    ) => {
        const url = `/branches?pageIndex=${pageIndex || ""}&pageSize=${
            pageSize || ""
        }&organizationId=${organizationId || ""}`;
        return axiosInstance.get(url);
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
