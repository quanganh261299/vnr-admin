import { Navigate } from "react-router-dom";

type ProtectedRouteProps = {
  layout?: React.ElementType;
  isAllowed?: boolean;
  children?: React.ReactNode;
  roles?: string[];
  userRole?: string;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  layout: Layout,
  isAllowed = true,
  roles = [],
  userRole = '',
  children
}) => {
  const hasAccess = roles.length === 0 || roles.includes(userRole);

  return isAllowed && hasAccess ? (
    Layout ? (
      <Layout>
        {children}
      </Layout>
    ) : (
      <>
        {children}
      </>
    )
  ) : (
    <Navigate to={'/login'} replace={true} />
  );
};

export default ProtectedRoute;
