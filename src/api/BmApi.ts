import axiosInstance from "./axiosClients";

const BmApi = {
    getDataFromFacebook: () => {
        const url = "/datafacebook";
        return axiosInstance.get(url);
    },
};

export default BmApi;
