import axiosConfig from "@/lib/axios";

type Product = {
  product_id: String,
  quantity: String
}

export async function   (id: Number) {
  const res = await axiosConfig.get(`/api/v2/estore/estore_buyer_customers/${id}/estore_customer_addresses`);
  return res.data;
}

export async function placeOrder({products, address, deliveryDate}: {products: Product[], address: any, deliveryDate: Date}){
  const params = {
    products: products,
    address: address,
    delivery_date: deliveryDate,
  }
  const res = await axiosConfig.post("/api/v2/bc/estore/estore_order_checkouts", params);
  return res.data
}

export async function fetchOrders({status, page}: {status: string, page: Number}){
  const params = {
    status: status,
    page: page,
  }
  const res = await axiosConfig.get("/api/v2/bc/estore/estore_onetime_orders", {params: params})
  return res.data
}
