import axiosInstance from "./axiosClients";

const statisticApi = {
    getTotalAmountSpent: (params: {
        startTime: string;
        endTime: string;
        organizationId?: string;
        branchId?: string;
        groupId?: string;
    }) => {
        const url = "Dashboard/spend";
        return axiosInstance.get(url, { params });
    },
    getHighestResultEmployee: (params: {
        startTime: string;
        endTime: string;
        organizationId?: string;
        branchId?: string;
        groupId?: string;
    }) => {
        const url = "Dashboard/result";
        return axiosInstance.get(url, { params });
    },
    getTotalCostPerResult: (params: {
        startTime: string;
        endTime: string;
        organizationId?: string;
        branchId?: string;
        groupId?: string;
    }) => {
        const url = "Dashboard/costPerResult";
        return axiosInstance.get(url, { params });
    },
    getTotalResultCampaign: (params: {
        startTime: string;
        endTime: string;
        organizationId?: string;
        branchId?: string;
        groupId?: string;
    }) => {
        const url = "Dashboard/campaign";
        return axiosInstance.get(url, { params });
    },
};

export default statisticApi;
