import nookies, { destroyCookie, parseCookies, setCookie } from "nookies";
import { isEmpty } from "lodash";

export const setCookies = ({headers}: any) => {
  setCookie(null, "auth_token", JSON.stringify(headers), {
    path: "/",
  })
}

export const getCookies = () => {
  const cookies = parseCookies();
  if (!isEmpty(cookies?.auth_token)) {
    return JSON.parse(cookies.auth_token);
  }
  return {};
};

export const destroyCookies = () => {
  destroyCookie(null, "auth_token", { path: "/" });
};

// Server side cookies
export const getSSCookies = (ctx:any) => {
  const cookies = nookies.get(ctx);
  if (!isEmpty(cookies?.auth_token)) {
    return JSON.parse(cookies.auth_token);
  }
  return {};
};

export const fetchAuth = () => {
  const headers = getCookies();
  const isLoggedIn = !!headers.client;

  return {
    isLoggedIn,
    user_name: headers?.name,
    user_id: headers?.id,
  }
}