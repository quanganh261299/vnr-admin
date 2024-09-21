export const clearAuthStatus = () => {
    localStorage.clear();
};

export const storeAuthStatus = (token: string, role: string) => {
    localStorage.setItem("role", role);
    localStorage.setItem("token", token);
    localStorage.setItem("isAllowed", "true");
};

export const storeAuthFBStatus = (token: string) => {
    localStorage.setItem("isBM", "true");
    localStorage.setItem("BmToken", token);
    localStorage.setItem("isAllowed", "true");
};

export const getAuthStatus = () => {
    const auth =
        localStorage.getItem("isAllowed") && localStorage.getItem("token");
    return !!auth;
};

export const getAuthFbStatus = () => {
    const auth =
        localStorage.getItem("isAllowed") && localStorage.getItem("BmToken");
    return !!auth;
};
