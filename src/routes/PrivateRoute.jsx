import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AutContext";
import PropTypes from "prop-types";
import { showToast } from "../components/common/Toasts";
import { useEffect, useRef } from "react";

const PrivateRoute = ({ permission, children }) => {
  const { user, hasPermission, isLoading } = useAuth();
  const location = useLocation();
  const toastShown = useRef({});

  useEffect(() => {
    if (
      user &&
      user.mustChangePassword &&
      !isLoading &&
      !toastShown.current[location.pathname]
    ) {
      showToast("warning", "Vous devez changer votre mot de passe.");
      toastShown.current[location.pathname] = true;
    }
  }, [user, isLoading, location.pathname]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 border-solid"></div>
      </div>
    );
  }

  // Redirige si pas connecté
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirige si l'utilisateur doit changer son mot de passe
  if (user.mustChangePassword) {
    return <Navigate to="/login" replace />;
  }

  // Redirige si pas la permission
  if (permission && !hasPermission(permission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

PrivateRoute.propTypes = {
  permission: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
