import PropTypes from "prop-types";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";

const toastConfig = {
  success: {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  },
  error: {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  },
  warning: {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  },
};

export const showToast = (type, message) => {
  switch (type) {
    case "success":
      toast.success(message, toastConfig.success);
      break;
    case "error":
      toast.error(message, toastConfig.error);
      break;
    case "warning":
      toast.warn(message, toastConfig.warning);
      break;
    default:
      toast(message, toastConfig.warning);
  }
};

const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    if (message) {
      showToast(type, message);

      const timer = setTimeout(() => {
        onClose?.();
      }, toastConfig[type]?.autoClose || 3000);

      return () => clearTimeout(timer);
    }
  }, [message, type, onClose]);

  return <ToastContainer />;
};

Toast.propTypes = {
  message: PropTypes.string,
  type: PropTypes.oneOf(["success", "error", "warning"]),
  onClose: PropTypes.func,
};

Toast.defaultProps = {
  message: "",
  type: "success",
  onClose: () => {},
};

export default Toast;