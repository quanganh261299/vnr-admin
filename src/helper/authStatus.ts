import { ROLE } from "./const";

export const clearAuthStatus = () => {
    localStorage.clear();
};

export const storeAuthStatus = (
    token: string,
    role: string,
    identifyId: string
) => {
    localStorage.setItem("role", role);
    localStorage.setItem("token", token);
    switch (role) {
        case ROLE.ORGANIZATION:
            return localStorage.setItem("organizationId", identifyId);
        case ROLE.BRANCH:
            return localStorage.setItem("branchId", identifyId);
        case ROLE.GROUP:
            return localStorage.setItem("groupId", identifyId);
        default:
            localStorage.removeItem("organizationId");
            localStorage.removeItem("branchId");
            localStorage.removeItem("groupId");
    }
};

export const storeAuthFBStatus = (token: string) => {
    localStorage.setItem("isBM", "true");
    localStorage.setItem("BmToken", token);
};

export const getAuthStatus = () => {
    const auth = localStorage.getItem("token");
    return !!auth;
};

export const getAuthFbStatus = () => {
    const auth = localStorage.getItem("BmToken");
    return !!auth;
};
