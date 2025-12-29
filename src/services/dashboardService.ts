import axios from "@/lib/axios";

export async function getDashboardData(params: { page: number; latitude?: string; longitude?: string; }) {
  const  response  = await axios.get("/api/v2/bc/estore/estore_dashboard", { params, });
  return response.data;
}

export async function fetchCategoryProducts({ id, latitude, longitude, page }: {id?: number | undefined | null, latitude:string, longitude:string, page?: number }) {
  const response = await axios.get(`/api/v2/bc/estore/estore_product_categories/${id}/estore_category_products`, 
    {
      params: { page: page },
    }
  );

  return response.data;
}

export async function checkServiceAvailableInArea(params: { latitude: string; longitude: string }) {
  const response = await axios.get(
    "/api/v2/bc/estore/estore_delivery_locations/check_service_available_in_area",
    { params }
  );
  return response.data;
}