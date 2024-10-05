import { ROLE } from "./const";

export const clearAuthStatusAdmin = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
};

export const clearAuthStatusBm = () => {
    localStorage.removeItem('tokenBm');
    localStorage.removeItem('profileFacebook')
}

export const storeAuthStatus = (
    token: string,
    role: string,
    organizationId: string,
    branchId: string,
    groupId: string
) => {
    localStorage.setItem("role", role);
    localStorage.setItem("token", token);
    switch (role) {
        case ROLE.ORGANIZATION:
            return localStorage.setItem("organizationId", organizationId);
        case ROLE.BRANCH:
            localStorage.setItem("organizationId", organizationId);
            return localStorage.setItem("branchId", branchId);
        case ROLE.GROUP:
            localStorage.setItem("organizationId", organizationId);
            localStorage.setItem("branchId", branchId);
            return localStorage.setItem("groupId", groupId);
        default:
            localStorage.removeItem("organizationId");
            localStorage.removeItem("branchId");
            localStorage.removeItem("groupId");
    }
};

export const storeAuthFBStatus = (token: string) => {
    localStorage.setItem("BmToken", token);
};

export const getAuthStatus = () => {
    const auth = localStorage.getItem("token");
    return !!auth;
};

export const getAuthFbStatus = () => {
    const auth = localStorage.getItem("BmToken");
    console.log(auth)
    return !!auth;
};
