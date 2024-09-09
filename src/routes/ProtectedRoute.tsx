import { Navigate, Outlet } from "react-router-dom";

type ProtectedRouteProps = {
  layout: React.ElementType;
  isAllowed: boolean;
  children?: React.ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ layout: Layout, isAllowed }) => {

  return isAllowed ? (
    <Layout>
      <Outlet />
    </Layout>
  ) : (
    <Navigate to="/login" replace={true} />
  );
};

export default ProtectedRoute;