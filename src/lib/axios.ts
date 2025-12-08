import axios from "axios";
import { getCookies } from "./appCookies";

const getHeaders = () => {
  const headers = getCookies();
  return {
    "access-token": headers["access-token"],
    client: headers.client,
    uid: headers.uid,
    Accept: "application/json",
    appversion: 512,
    ISCLONEAPP: true,
    CUSTOMERAPP: true,
    APPKEY: "d41d8$cD97fC0bK04@9800998ecf8427e"
    // 'content-type': 'application/x-www-form-urlencoded'
  };
};


const axiosConfig = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: getHeaders(),
});

export default axiosConfig;