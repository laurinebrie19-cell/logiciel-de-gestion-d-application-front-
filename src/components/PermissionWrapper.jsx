import PropTypes from "prop-types";
import { useAuth } from "../contexts/AutContext";

const PermissionWrapper = ({ permission, children }) => {
  const { hasPermission } = useAuth();

  // verifie si l'user à la permission requise

  if (!hasPermission(permission)) return null;
  return children;
};

PermissionWrapper.propTypes = {
  permission: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default PermissionWrapper;
