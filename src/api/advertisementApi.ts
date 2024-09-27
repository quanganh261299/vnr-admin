import { TCreateAdsAccount } from "../models/advertisement/advertisement";
import axiosInstance from "./axiosClients";

const advertisementApi = {
    getListAdsAccount: (params?: {
        pageIndex?: number;
        pageSize?: number;
        isDelete?: boolean;
        organizationId?: string;
        branchId?: string;
        groupId?: string;
        employeeId?: string;
    }) => {
        const url = `/adsAccount`;
        return axiosInstance.get(url, { params });
    },
    getListAdsAccountActive: (params?: {
        pageIndex?: number;
        pageSize?: number;
        organizationId?: string;
        branchId?: string;
        groupId?: string;
        employeeId?: string;
    }) => {
        const url = "/adsAccount/isActive";
        return axiosInstance.get(url, { params });
    },
    getListCampaigns: (params?: {
        adsAccountId: string;
        pageIndex?: number;
        pageSize?: number;
        start?: string;
        end?: string;
    }) => {
        const url = "/campaign";
        return axiosInstance.get(url, { params });
    },
    getListAdSet: (params?: {
        adsAccountId: string;
        pageIndex?: number;
        pageSize?: number;
        start?: string;
        end?: string;
    }) => {
        const url = "/Adset";
        return axiosInstance.get(url, { params });
    },
    getListAd: (params?: {
        adsAccountId: string;
        pageIndex?: number;
        pageSize?: number;
        start?: string;
        end?: string;
    }) => {
        const url = "/Ads";
        return axiosInstance.get(url, { params });
    },
    getListBm: (groupId?: string) => {
        const url = `/bm?groupId=${groupId}`;
        return axiosInstance.get(url);
    },
    createAdsAccount: (data: TCreateAdsAccount) => {
        const url = "/adsAccount";
        return axiosInstance.post(url, data);
    },
    createAdsAccountByExcel: (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        const url = "/adsAccount/excel";
        return axiosInstance.post(url, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },
    updateAdsAccount: (data: TCreateAdsAccount) => {
        const url = "/adsAccount";
        return axiosInstance.put(url, data);
    },
    deleteAndRecoverAdsAccount: (id: string) => {
        const url = `/adsAccount/${id}/toggle`;
        return axiosInstance.put(url);
    },
    deleteAdsAccount: (id: string) => {
        const url = `/adsAccount/${id}`;
        return axiosInstance.delete(url);
    },
};

export default advertisementApi;
