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
};

export default statisticApi;
