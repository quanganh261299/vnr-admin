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
import LoginPM from "../pages/LoginPM/LoginPM";
import CreateOrganizationAccount from "../pages/CreateOrganizationAccount/CreateOrganizationAccount";


export const route = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: '/loginPM',
    element: <LoginPM />
  },
  {
    path: "/",
    element: <ProtectedRoute isAllowed={getAuthStatus()} layout={ManagementLayout} role="ADMIN" />,
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
    path: "/advertisement-account?isPM=true",
    element: <ProtectedRoute isAllowed={getAuthStatus()} layout={ManagementLayout} role="PM" />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
      }
    ]
  }
]