import { Navigate, Outlet } from "react-router-dom";

type ProtectedRouteProps = {
  layout: React.ElementType;
  isAllowed: boolean;
  role: 'ADMIN' | 'PM';
  children?: React.ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ layout: Layout, isAllowed, role }) => {

  return isAllowed ? (
    <Layout>
      <Outlet />
    </Layout>
  ) : (
    <Navigate to={`${role === 'ADMIN' ? '/login' : '/loginPM'}`} replace={true} />
  );
};

export default ProtectedRoute;