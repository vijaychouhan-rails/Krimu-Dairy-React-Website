import { setCookies } from "@/lib/appCookies";
import axiosConfig from "@/lib/axios";

interface LoginPayload {
  mobileNo: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  error?: string;
}

export const  login = async ({
  mobileNo,
  password,
}: LoginPayload): Promise<LoginResponse> => 
  {
  return axiosConfig
    .post("/api/v1/auth/sign_in", { mobile_no: mobileNo, password })
    .then((response) => {

      if (response.status === 200) {
        const h = response.headers;
        const headers = {
          "access-token": h["access-token"],
          client: h.client,
          uid: h.uid,
          id: response?.data?.data?.id,
          name: response?.data?.data?.name,
          dairyName: response?.data?.data?.dairy_name,
        };
        setCookies({ headers });
        return { success: true };
      } 
      
      return { success: false, error: response.data?.errors };
    })
    .catch((err) => {
      return { success: false, error: err || "Unknown error" };
    });
};

export const logoutOperation = async () => {
  const data = await axiosConfig.delete("/api/v1/auth/sign_out");
  return data;
};
