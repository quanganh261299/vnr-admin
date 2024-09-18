import axiosInstance from "./axiosClients";

const statisticApi = {
    getTotalAmountSpent: (
        startTime: string,
        endTime: string,
        organizationId?: string,
        branchId?: string,
        groupId?: string
    ) => {
        const url = `Dashboard/spend?start=${startTime}T01:00:00&end=${endTime}T23:59:59&organizationId=${
            organizationId || ""
        }&branchId=${branchId || ""}&groupId=${groupId || ""}`;
        return axiosInstance.get(url);
    },
    getHighestResultEmployee: (
        startTime: string,
        endTime: string,
        organizationId?: string,
        branchId?: string,
        groupId?: string
    ) => {
        const url = `Dashboard/result?start=${startTime}T01:00:00&end=${endTime}T23:59:59&organizationId=${
            organizationId || ""
        }&branchId=${branchId || ""}&groupId=${groupId || ""}`;
        return axiosInstance.get(url);
    },
    getTotalCostPerResult: (
        startTime: string,
        endTime: string,
        organizationId?: string,
        branchId?: string,
        groupId?: string
    ) => {
        const url = `Dashboard/costPerResult?start=${startTime}T01:00:00&end=${endTime}T23:59:59&organizationId=${
            organizationId || ""
        }&branchId=${branchId || ""}&groupId=${groupId || ""}`;
        return axiosInstance.get(url);
    },
    getTotalResultCampaign: (
        startTime: string,
        endTime: string,
        organizationId?: string,
        branchId?: string,
        groupId?: string
    ) => {
        const url = `Dashboard/campaign?start=${startTime}T01:00:00&end=${endTime}T23:59:59&organizationId=${
            organizationId || ""
        }&branchId=${branchId || ""}&groupId=${groupId || ""}`;
        return axiosInstance.get(url);
    },
};

export default statisticApi;
