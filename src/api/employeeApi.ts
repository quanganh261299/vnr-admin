import { TMemberField } from "../models/member/member";
import axiosInstance from "./axiosClients";

const employeeApi = {
    createEmployee: (data: TMemberField) => {
        const url = "/employee";
        return axiosInstance.post(url, data);
    },
    getListEmployee: (params?: {
        pageIndex?: number;
        pageSize?: number;
        organizationId?: string;
        branchId?: string;
        groupId?: string;
    }) => {
        const url = "/employee";
        return axiosInstance.get(url, { params });
    },
    updateEmployee: (data: TMemberField) => {
        const url = "/employee";
        return axiosInstance.put(url, data);
    },
    deleteEmployee: (id: string) => {
        const url = `/employee?id=${id}`;
        return axiosInstance.delete(url);
    },
};

export default employeeApi;
