export const clearAuthStatus = () => {
    localStorage.removeItem("isAllowed");
    localStorage.removeItem("token");
};

export const storeAuthStatus = (token: string) => {
    clearAuthStatus();
    localStorage.setItem("token", token);
    localStorage.setItem("isAllowed", "true");
};

export const storeAuthFBStatus = (token: string) => {
    console.log(token);
    localStorage.setItem("isAllowed", "true");
};

export const getAuthStatus = () => {
    const auth =
        localStorage.getItem("isAllowed") && localStorage.getItem("token");
    return !!auth;
};
