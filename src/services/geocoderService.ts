import axios from "@/lib/axios";

export async function getAddressFromCoordinates(params: { latitude: string; longitude: string }) {
  const response = await axios.post("/api/v1/geocoders/get_address", params);
  return response.data;
}
