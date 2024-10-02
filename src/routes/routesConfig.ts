export const EPath = {
    loginPage: "/login",
    loginBmPage: "/loginBM",
    dashboard: "/",
    systemManagement: "/system",
    agencyManagement: "/agency",
    teamManagement: "/team",
    memberManagement: "/member",

    // Advertisement Section
    advertisementManagement: "/advertisement-account",
    campaignManagement: "/advertisement-account/:accountId/campaigns",
    adSetManagement:
        "/advertisement-account/:accountId/campaigns/:campaignId/adsets",
    adManagement:
        "/advertisement-account/:accountId/campaigns/:campaignId/adsets/:adsetsId/ad",

    // Account
    systemAccount: "/account",
    adAccount: "/ad-account",
    deletedAdAccount: "/ad-account?isDeleted=true",
    bmAccount: "/bm-account",
    statistic: "/statistic",

    // BM
    bmHomePage: "/bm-homepage",
};
