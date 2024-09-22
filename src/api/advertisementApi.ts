import { TCreateAdsAccount } from "../models/advertisement/advertisement";
import axiosInstance from "./axiosClients";

const advertisementApi = {
    getListAdsAccount: (params?: { pageIndex?: number; pageSize?: number }) => {
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
        accountId: string;
        pageIndex?: number;
        pageSize?: number;
        startTime?: string;
        endTime?: string;
    }) => {
        const url = "/campaign";
        return axiosInstance.get(url, { params });
    },
    getListAdSet: (params?: {
        campaignId: string;
        pageIndex?: number;
        pageSize?: number;
        startTime?: string;
        endTime?: string;
    }) => {
        const url = "/Adset";
        return axiosInstance.get(url, { params });
    },
    getListAd: (params?: {
        adSetId: string;
        pageIndex?: number;
        pageSize?: number;
        startTime?: string;
        endTime?: string;
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
    updateAdsAccount: (data: TCreateAdsAccount) => {
        const url = "/adsAccount";
        return axiosInstance.put(url, data);
    },
    deleteAdsAccount: (id: string) => {
        const url = `/adsAccount/${id}`;
        return axiosInstance.delete(url);
    },
};

export default advertisementApi;
