import { TCreateAdsAccount } from "../models/advertisement/advertisement";
import axiosInstance from "./axiosClients";

const advertisementApi = {
    getListAdsAccount: (pageIndex?: number, pageSize?: number) => {
        const url = `/adsAccount?pageIndex=${pageIndex}&pageSize=${pageSize}`;
        return axiosInstance.get(url);
    },
    getListAdsAccountActive: (
        pageIndex?: number,
        pageSize?: number,
        organizationId?: string,
        branchId?: string,
        groupId?: string,
        employeeId?: string
    ) => {
        const url = `/adsAccount/isActive?pageIndex=${pageIndex}&pageSize=${pageSize}&organizationId=${
            organizationId || ""
        }&branchId=${branchId || ""}&groupId=${groupId || ""}&employeeId=${
            employeeId || ""
        }`;
        return axiosInstance.get(url);
    },
    getListCampaigns: (
        accountId: string,
        pageIndex?: number | string,
        pageSize?: number | string
    ) => {
        const url = `/campaign?pageIndex=${pageIndex || ""}&pageSize=${
            pageSize || ""
        }&adsAccountId=${accountId}`;
        return axiosInstance.get(url);
    },
    getListAdSet: (
        campaignId: string,
        pageIndex?: number,
        pageSize?: number
    ) => {
        const url = `/Adset?pageIndex=${pageIndex}&pageSize=${pageSize}&adsAccountId=${campaignId}`;
        return axiosInstance.get(url);
    },
    getListAd: (adSetId: string, pageIndex?: number, pageSize?: number) => {
        const url = `/Ads?pageIndex=${pageIndex}&pageSize=${pageSize}&adsAccountId=${adSetId}`;
        return axiosInstance.get(url);
    },
    createAdsAccount: (data: TCreateAdsAccount) => {
        const url = "/adsAccount";
        return axiosInstance.post(url, data);
    },
};

export default advertisementApi;
