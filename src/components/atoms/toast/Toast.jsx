import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@styles/atoms/Toast.css";

const defaultOptions = {
    position: "bottom-center",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
};

const toastClassMap = {
    default: "custom-toast",
    point: "custom-toast-point",
};

export const showSuccessToast = (message, options = {}) => {
    const { toastType = "default", ...rest } = options;

    return toast.success(message, {
        ...defaultOptions,
        ...rest,
        className: toastClassMap[toastType],
    });
};

export const showErrorToast = (message, options = {}) => {
    const { toastType = "default", ...rest } = options;

    return toast.error(message, {
        ...defaultOptions,
        ...rest,
        className: toastClassMap[toastType],
    });
};

export const showInfoToast = (message, options = {}) => {
    const { toastType = "default", ...rest } = options;

    return toast.info(message, {
        ...defaultOptions,
        ...rest,
        className: toastClassMap[toastType],
    });
};

export default function Toast() {
    return <ToastContainer {...defaultOptions} closeButton={false} />;
}
