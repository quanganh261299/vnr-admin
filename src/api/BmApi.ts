import axiosBmInstance from "./axiosClientsBm";

const BmApi = {
    getDataFromFacebook: (startTime: string, endTime: string) => {
        const url = `/datafacebook?since=${startTime}&until=${endTime}`;
        return axiosBmInstance.get(url);
    },
};

export default BmApi;
