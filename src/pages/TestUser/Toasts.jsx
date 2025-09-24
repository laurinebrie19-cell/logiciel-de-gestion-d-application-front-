import PropTypes from "prop-types";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";

const Toast = ({ message, type, onClose }) => {
  // Configuration par type
  const configs = {
    success: {
      type: toast.success,
      config: {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        onClose: onClose,
      },
    },
    error: {
      type: toast.error,
      config: {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        onClose: onClose,
      },
    },
    warning: {
      type: toast.warn,
      config: {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        onClose: onClose,
      },
    },
  };

  // Sélectionner la configuration en fonction du type
  const selectedConfig = configs[type] || configs.error;

  // Afficher le toast
  selectedConfig.type(message, selectedConfig.config);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
      >
        <ToastContainer />
      </motion.div>
    </AnimatePresence>
  );
};

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["success", "error", "warning"]),
  onClose: PropTypes.func,
};

Toast.defaultProps = {
  type: "error",
  onClose: () => {},
};

export default Toast;
