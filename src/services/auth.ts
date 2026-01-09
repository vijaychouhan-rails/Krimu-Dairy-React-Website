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

interface RegisterPayload {
  name: string;
  mobileNo: string;
  password: string;
  role: string;
}

interface RegisterResponse {
  success: boolean;
  error?: string;
}

interface OtpVerifyPayload {
  mobileNo: string;
  otp: string;
  name: string;
  password: string;
  role: string;
}

interface OtpVerifyResponse {
  success: boolean;
  error?: string;
}

export const login = async ({
  mobileNo,
  password,
}: LoginPayload): Promise<LoginResponse> => {
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
          isDairyJoined: response?.data?.data?.joined_brand_app_dairy,
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

export const verifyOtp = async ({
  mobileNo,
  otp,
  name,
  password,
  role,
}: OtpVerifyPayload): Promise<OtpVerifyResponse> => {
  const payload = {
    mobile_no: mobileNo,
    otpStep: true,
    otp,
    name,
    password,
    role,
    registration: {
      name,
      mobile_no: mobileNo,
      password,
      role,
    },
  };

  return axiosConfig
    .post("/api/v1/auth", payload)
    .then((response) => {
      debugger
      if (response.status === 200 || response.status === 201) {
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

export const register = async ({
  name,
  mobileNo,
  password,
  role,
}: RegisterPayload): Promise<RegisterResponse> => {
  const payload = {
    name,
    mobile_no: mobileNo,
    password,
    role,
    registration: {
      name,
      mobile_no: mobileNo,
      password,
      role,
    },
  };

  return axiosConfig
    .post("/api/v1/auth", payload)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
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
