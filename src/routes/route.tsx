import AdManagement from "../pages/AdManagement/AdManagement";
import AdSetManagement from "../pages/AdSetManagement/AdSetManagement";
import AdvertisementManagement from "../pages/AdvertisementManagement/AdvertisementManagement";
import AgencyManagement from "../pages/AgencyManagement/AgencyManagement";
import CampaignsManagment from "../pages/CampaignsManagement/CampaignsManagement";
import ErrorPage from "../Components/Error/ErrorPage";
import Login from "../pages/Login/Login";
import MemberManagement from "../pages/MemberManagement/MemberManagement";
import SystemManagement from "../pages/SystemManagement/SystemManagement";
import TeamManagement from "../pages/TeamManagement/TeamManagement";
import { getAuthFbStatus, getAuthStatus } from "../helper/authStatus";
import ManagementLayout from "../Layout/AdminLayout/ManagementLayout";
import ProtectedRoute from "./ProtectedRoute";
import LoginBM from "../pages/LoginBM/LoginBM";
import SystemAccount from "../pages/SystemAccount/SystemAccount";
import AdAccount from "../pages/AdAccount/AdAccount";
import BmAccount from "../pages/BmAccount/BmAccount";
import BMLayout from "../Layout/BMLayout/BMLayout";
import BmHomePage from "../pages/BmHomepage/BmHomePage";
import StatisticManagement from "../pages/StatisticManagement/StatisticManagement";
import PrivacyPolicy from "../pages/PrivacyPolicy/PrivacyPolicy";
import TermsOfUse from "../pages/TermsOfUse/TermsOfUse";
import { handleRole, ROLE } from "../helper/const";

const role = localStorage.getItem('role')
export const route = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: '/loginBM',
    element: <LoginBM />
  },
  {
    path: '/privacy-policy',
    element: <PrivacyPolicy />
  },
  {
    path: '/terms-of-use',
    element: <TermsOfUse />
  },
  {
    path: "/",
    element:
      <ProtectedRoute
        isAllowed={getAuthStatus()}
        layout={ManagementLayout}
        roles={[ROLE.ADMIN, ROLE.ORGANIZATION, ROLE.BRANCH, ROLE.GROUP]}
        userRole={String(role)}
      />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: role && handleRole([ROLE.ADMIN], role) ? <SystemManagement /> : <ErrorPage />
      },
      {
        path: '/agency',
        element:
          role && handleRole([ROLE.ADMIN, ROLE.ORGANIZATION], role) ? <AgencyManagement /> : <ErrorPage />
      },
      {
        path: '/team',
        element:
          role && handleRole([ROLE.ADMIN, ROLE.ORGANIZATION, ROLE.BRANCH], role) ? <TeamManagement /> : <ErrorPage />
      },
      {
        path: '/member',
        element:
          role
            && handleRole([ROLE.ADMIN, ROLE.ORGANIZATION, ROLE.BRANCH, ROLE.GROUP], role) ? <MemberManagement /> : <ErrorPage />
      },
      {
        path: '/advertisement-account',
        element: <AdvertisementManagement />,
      },
      {
        path: '/advertisement-account/:accountId/campaigns',
        element: <CampaignsManagment />
      },
      {
        path: '/advertisement-account/:accountId/campaigns/:campaignId/adsets',
        element: <AdSetManagement />
      },
      {
        path: '/advertisement-account/:accountId/campaigns/:campaignId/adsets/:adsetsId/ad',
        element: <AdManagement />
      },
      {
        path: '/account',
        element: role && handleRole([ROLE.ADMIN], role) ? <SystemAccount /> : <ErrorPage />
      },
      {
        path: '/ad-account',
        element: <AdAccount />
      },
      {
        path: '/ad-account?isDeleted=true',
        element: <AdAccount />
      },
      {
        path: '/bm-account',
        element: <BmAccount />
      },
      {
        path: '/statistic',
        element: <StatisticManagement />
      }
    ]
  },
  {
    path: "/bm-homepage",
    element: <ProtectedRoute isAllowed={getAuthFbStatus()} layout={BMLayout} roles={['bm']} userRole="bm" />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <BmHomePage />
      }
    ]
  }
]