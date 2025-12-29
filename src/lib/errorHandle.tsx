import { toast } from "react-toastify";
import { isArray, isString } from "lodash";
import { destroyCookies } from "./appCookies";

type ErrorWithResponse = {
  response?: {
    status?: number;
    data?: {
      errors?: string[];
      full_messages?: string[];
    };
  };
  message?: string;
};

const showErrorMessages = ({ error, action }: { error: unknown; action?: "auth" | "custom" }) => {
  let errMsg = "";
  let logout = false;
  if (action === "custom") {
    if (isArray(error)) {
      errMsg = error.join("\n");
    } else if (isString(error)) {
      errMsg = error;
    }
  } else if (isArray(error)) {
    errMsg = error.join("\n");
  } else if (isString(error)) {
    errMsg = error;
  } else if (typeof error === "object" && error !== null && "response" in error) {
    const err = error as ErrorWithResponse;
    const status = err.response?.status;

    if (status === 401 && action === "auth") {
      errMsg = (err.response?.data?.errors ?? []).join("\n");
    } else if (status === 401) {
      logout = true;
      errMsg = (err.response?.data?.errors ?? []).join("\n");
    } else if (status === 404) {
      errMsg = "Error 404: Contact us";
    } else if (status === 411) {
      errMsg = "Error 411: You are not authorize to access this page";
    } else if (status === 422) {
      const data = err.response?.data;
      const messages = (data?.full_messages ?? data?.errors ?? []) as string[];
      errMsg = messages.join("\n");
    }
  } else if ((error as { message?: string } | undefined)?.message === "Network Error") {
    errMsg =
      "Network Error! Please check your internet connection or try again later";
  }
//   } else if (!isEmpty(error.message)) {
//     errMsg = error.message;
//   }
  toast.error(errMsg, {
    toastId: errMsg,
  });

  if (logout) {
    destroyCookies();
    window.location.replace("/login");
  }
};

export default showErrorMessages;
