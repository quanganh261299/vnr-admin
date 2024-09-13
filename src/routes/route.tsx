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
import { getAuthStatus } from "../helper/authStatus";
import ManagementLayout from "../Layout/AdminLayout/ManagementLayout";
import ProtectedRoute from "./ProtectedRoute";
import LoginBM from "../pages/LoginBM/LoginBM";
import SystemAccount from "../pages/SystemAccount/SystemAccount";
import AdAccount from "../pages/AdAccount/AdAccount";
import BmAccount from "../pages/BmAccount/BmAccount";
import BMLayout from "../Layout/BMLayout/BMLayout";
import BmHomePage from "../pages/BmHomepage/BmHomePage";


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
    path: "/",
    element: <ProtectedRoute isAllowed={getAuthStatus()} layout={ManagementLayout} roles={['bm']} userRole="bm" />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <SystemManagement />
      },
      {
        path: '/agency',
        element: <AgencyManagement />
      },
      {
        path: '/team',
        element: <TeamManagement />
      },
      {
        path: '/member',
        element: <MemberManagement />
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
        element: <SystemAccount />
      },
      {
        path: '/ad-account',
        element: <AdAccount />
      },
      {
        path: '/bm-account',
        element: <BmAccount />
      }
    ]
  },
  {
    path: "/bm-homepage",
    element: <ProtectedRoute isAllowed={getAuthStatus()} layout={BMLayout} roles={['bm']} userRole="bm" />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <BmHomePage />
      }
    ]
  }
]