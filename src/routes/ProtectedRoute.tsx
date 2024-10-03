import { Navigate } from "react-router-dom";
import { EPath } from "./routesConfig";

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
  const hasAccess = roles.includes(userRole);

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
    <Navigate to={EPath.loginPage} replace={true} />
  );
};

export default ProtectedRoute;
