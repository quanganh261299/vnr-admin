import { TCreateAdsAccount } from "../models/advertisement/advertisement";
import axiosInstance from "./axiosClients";

const advertisementApi = {
    getListAdsAccount: (pageIndex?: number, pageSize?: number) => {
        const url = `/adsAccount?pageIndex=${pageIndex}&pageSize=${pageSize}`;
        return axiosInstance.get(url);
    },
    getListCampaigns: (
        accountId: string,
        pageIndex?: number,
        pageSize?: number
    ) => {
        const url = `/campaign?pageIndex=${pageIndex}&pageSize=${pageSize}&adsAccountId=${accountId}`;
        return axiosInstance.get(url);
    },
    createAdsAccount: (data: TCreateAdsAccount) => {
        const url = "/adsAccount";
        return axiosInstance.post(url, data);
    },
};

export default advertisementApi;
