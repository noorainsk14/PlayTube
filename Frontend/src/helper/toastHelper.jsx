// toastHelpers.jsx
import { toast } from "react-hot-toast";
import { MdErrorOutline } from "react-icons/md";
import { MdCheckCircle } from "react-icons/md";

export const showErrorToast = (message) => {
  toast.error(message, {
    icon: <MdErrorOutline className="text-white" size={20} />,
    style: {
      background: "#333",
      color: "#fff",
      borderRadius: "10px",
      padding: "12px 16px",
      fontWeight: "500",
    },
  });
};

export const showSuccessToast = (message) => {
  toast.success(message, {
    icon: <MdCheckCircle className="text-white" size={20} />,
    style: {
      background: "#22c55e", // green-500
      color: "#fff",
      borderRadius: "10px",
      padding: "12px 16px",
      fontWeight: "500",
    },
  });
};
