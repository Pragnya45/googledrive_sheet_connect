import { toast } from "sonner";

function useNotification() {
  const showMessage = ({ type = "success", value }) => {
    switch (type) {
      case "success":
        toast.success(value);
        break;
      case "error":
        toast.error(value);
        break;

      default:
        toast.success(value);
        break;
    }
  };

  return { showMessage };
}

export { useNotification };
