import axiosBmInstance from "./axiosClientsBm";

const BmApi = {
    getDataFromFacebook: () => {
        const url = "/datafacebook";
        return axiosBmInstance.get(url);
    },
};

export default BmApi;
