import { toast } from "react-toastify";

export const showToast = (message, toastId = "global-error", tipe) => {
  if (toast.isActive(toastId)) {
    toast.update(toastId, {
      render: message,
      type: tipe,
      autoClose: 3000,
    });
  } else {
    toast(message, {
      toastId,
      type: tipe,
      autoClose: 3000,
    });
  }
};
