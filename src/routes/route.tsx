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
import ManagementLayout from "../Layout/ManagementLayout";
import ProtectedRoute from "./ProtectedRoute";
import CreateAccount from "../pages/CreateAccount/CreateAccount";
import ListAccount from "../pages/ListAccount/ListAccount";


export const route = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <ProtectedRoute isAllowed={getAuthStatus()} layout={ManagementLayout} />,
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
        path: '/create-account',
        element: <CreateAccount />
      },
      {
        path: '/account',
        element: <ListAccount />
      }
    ]
  },
]