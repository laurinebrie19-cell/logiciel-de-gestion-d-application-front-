import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AutContext";
import PropTypes from "prop-types";

const PublicRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  // Attendre que les données utilisateur soient chargées
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 border-solid"></div>
      </div>
    );
  }

  // Rediriger vers le tableau de bord si l'utilisateur est déjà connecté
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Afficher la page publique
  return children;
};

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PublicRoute;
