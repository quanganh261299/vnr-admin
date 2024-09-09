import { TypeTeamField } from "../models/team/team";
import axiosInstance from "./axiosClients";

const groupApi = {
    createGroup: (data: TypeTeamField) => {
        const url = "/groups";
        return axiosInstance.post(url, data);
    },
    getListGroup: (
        pageIndex?: number,
        pageSize?: number,
        organizationId?: string,
        branchId?: string
    ) => {
        const url = `/groups?pageIndex=${pageIndex || ""}&pageSize=${
            pageSize || ""
        }&organizationId=${organizationId || ""}&branchId=${branchId || ""}`;
        return axiosInstance.get(url);
    },
    updateGroup: (data: TypeTeamField) => {
        const url = "/groups";
        return axiosInstance.put(url, data);
    },
    deleteGroup: (id: string) => {
        const url = `/groups?id=${id}`;
        return axiosInstance.delete(url);
    },
};

export default groupApi;
