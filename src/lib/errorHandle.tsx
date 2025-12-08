import { toast } from "react-toastify";
import { isArray, isString } from "lodash";
import { destroyCookies } from "./appCookies";

const showErrorMessages = ({ error, action }: {error: any, action?: "auth" | "custom"}) => {
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
  } else if (
    error.response &&
    error.response.status === 401 &&
    action === "auth"
  ) {
    errMsg = error.response.data.errors.join("\n");
  } else if (error.response && error.response.status === 401) {
    logout = true;
    errMsg = error.response.data.errors.join("\n");
  } else if (error.response && error.response.status === 404) {
    errMsg = "Error 404: Contact us";
  } else if (error.response && error.response.status === 411) {
    errMsg = "Error 411: You are not authorize to access this page";
  } else if (error.response && error.response.status === 422) {
    errMsg = (
      error.response.data.errors?.full_messages ??
      error.response.data.errors ??
      []
    ).join("\n");
  } else if (error.message === "Network Error") {
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
