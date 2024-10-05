import AdManagement from "../pages/AdManagement/AdManagement";
import AdSetManagement from "../pages/AdSetManagement/AdSetManagement";
import AdvertisementManagement from "../pages/AdvertisementManagement/AdvertisementManagement";
import AgencyManagement from "../pages/AgencyManagement/AgencyManagement";
import CampaignsManagment from "../pages/CampaignsManagement/CampaignsManagement";
import ErrorPage from "../components/Error/ErrorPage";
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
import { hasRole, ROLE } from "../helper/const";
import Dashboard from "../pages/Dashboard/Dashboard";
import { EPath } from "./routesConfig";

const role = localStorage.getItem('role')
const organizationId = localStorage.getItem('organizationId') || null
const branchId = localStorage.getItem('branchId') || null
const groupId = localStorage.getItem('groupId') || null
export const route = [
  {
    path: EPath.loginPage,
    element: <Login />,
  },
  {
    path: EPath.loginBmPage,
    element: <LoginBM />
  },
  {
    path: EPath.dashboard,
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
        element: role && hasRole([ROLE.ADMIN], role) ? <Dashboard /> : <ErrorPage />
      },
      {
        path: EPath.systemManagement,
        element: role && hasRole([ROLE.ADMIN], role) ? <SystemManagement /> : <ErrorPage />
      },
      {
        path: EPath.agencyManagement,
        element:
          role && hasRole([ROLE.ADMIN, ROLE.ORGANIZATION], role)
            ?
            <AgencyManagement
              role={role}
              organizationId={organizationId}
            />
            :
            <ErrorPage />
      },
      {
        path: EPath.teamManagement,
        element:
          role && hasRole([ROLE.ADMIN, ROLE.ORGANIZATION, ROLE.BRANCH], role)
            ?
            <TeamManagement
              role={role}
              organizationId={organizationId}
              branchId={branchId}
            />
            :
            <ErrorPage />
      },
      {
        path: EPath.memberManagement,
        element:
          role
            && hasRole([ROLE.ADMIN, ROLE.ORGANIZATION, ROLE.BRANCH, ROLE.GROUP], role)
            ?
            <MemberManagement
              role={role}
              organizationId={organizationId}
              branchId={branchId}
              groupId={groupId}
            />
            :
            <ErrorPage />
      },
      {
        path: EPath.advertisementManagement,
        element:
          <AdvertisementManagement
            role={role}
            organizationId={organizationId}
            branchId={branchId}
            groupId={groupId}
          />,
      },
      {
        path: EPath.campaignManagement,
        element: <CampaignsManagment />
      },
      {
        path: EPath.adSetManagement,
        element: <AdSetManagement />
      },
      {
        path: EPath.adManagement,
        element: <AdManagement />
      },
      {
        path: EPath.systemAccount,
        element:
          role
            && hasRole([ROLE.ADMIN, ROLE.ORGANIZATION, ROLE.BRANCH], role)
            ?
            <SystemAccount
              role={role}
              organizationId={organizationId}
              branchId={branchId}
            />
            :
            <ErrorPage />
      },
      {
        path: EPath.adAccount,
        element:
          <AdAccount
            role={role}
            organizationId={organizationId}
            branchId={branchId}
            groupId={groupId}
          />
      },
      {
        path: EPath.deletedAdAccount,
        element:
          <AdAccount
            role={role}
            organizationId={organizationId}
            branchId={branchId}
            groupId={groupId}
          />
      },
      {
        path: EPath.bmAccount,
        element:
          <BmAccount
            role={role}
            organizationId={organizationId}
            branchId={branchId}
            groupId={groupId}
          />
      },
      {
        path: EPath.statistic,
        element:
          <StatisticManagement
            role={role}
            organizationId={organizationId}
            branchId={branchId}
            groupId={groupId}
          />
      }
    ]
  },
  {
    path: EPath.bmHomePage,
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