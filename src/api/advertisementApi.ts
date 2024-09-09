import axiosInstance from "./axiosClients";

const advertisementApi = {
    getListAdsAccount: (pageIndex?: number, pageSize?: number) => {
        const url = `/adsAccount?pageIndex=${pageIndex}&pageSize=${pageSize}`;
        return axiosInstance.get(url);
    },
};

export default advertisementApi;
