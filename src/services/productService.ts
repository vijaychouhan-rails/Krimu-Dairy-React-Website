import axios from "@/lib/axios";

export async function fetchProductCategories() {
  const response = await axios.get("/api/v2/bc/estore/categories");
  return response.data.categories;
}

export async function fetchCategoryProducts({
  id,
  latitude,
  longitude,
  page,
}: {
  id: number | null;
  latitude: string;
  longitude: string;
  page?: number;
}) {
  const params = {
    latitude,
    longitude,
    page,
  };

  const response = await axios.get(
    `/api/v2/bc/estore/estore_product_categories/${id}/estore_category_products`,
    {
      params,
    }
  );

  return response.data;
}
