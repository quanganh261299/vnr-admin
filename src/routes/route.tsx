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
import ListAccount from "../pages/ListAccount/ListAccount";
import CreateOrganizationAccount from "../pages/CreateOrganizationAccount/CreateOrganizationAccount";
import LoginBM from "../pages/LoginBM/LoginPM";


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
        path: '/create-organization-account',
        element: <CreateOrganizationAccount />
      },
      {
        path: '/account',
        element: <ListAccount />
      }
    ]
  },
  {
    path: "/advertisement-account?isBM=true",
    element: <ProtectedRoute isAllowed={getAuthStatus()} layout={ManagementLayout} roles={['bm']} userRole="bm" />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
      }
    ]
  }
]