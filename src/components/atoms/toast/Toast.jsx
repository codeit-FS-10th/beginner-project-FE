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

export const showSuccessToast = (message, options = {}) =>
    toast.success(message, { ...defaultOptions, ...options });

export const showErrorToast = (message, options = {}) =>
    toast.error(message, { ...defaultOptions, ...options });

export const showInfoToast = (message, options = {}) =>
    toast.info(message, { ...defaultOptions, ...options });

export default function Toast() {
    return (
        <ToastContainer
            {...defaultOptions}
            closeButton={false}
            toastClassName={() => "custom-toast"}
            bodyClassName={() => "custom-toast-body"}
            progressClassName="custom-toast-progress"
        />
    );
}
