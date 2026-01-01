import axios from "@/lib/axios";

export async function getAddressFromCoordinates(params: { latitude: string; longitude: string }) {
  const response = await axios.post("/api/v1/geocoders/get_address", params);
  return response.data;
}

export async function searchLocation(params: { address: string }) {
  const response = await axios.get("/api/v1/geocoders/lat_long", {
    params: { address: params.address },
  });
  return response.data;
}
