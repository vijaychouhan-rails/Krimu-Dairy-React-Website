import axiosConfig from "@/lib/axios";

type Product = {
  product_id: string;
  quantity: number;
};

export async function fetchDeliveryAddresses(id: number) {
  const res = await axiosConfig.get(`/api/v2/estore/estore_buyer_customers/${id}/estore_customer_addresses`);
  return res.data;
}

export async function placeOrder({
  products,
  address,
  deliveryDate,
  deliveryInstruction,
  couponCode,
}: {
  products: Product[];
  address: Record<string, unknown>;
  deliveryDate: Date;
  deliveryInstruction: string;
  couponCode: string;
}) {
  const delivery_date_iso = new Date(deliveryDate).toISOString();

  const basePayload = {
    products,
    delivery_date: delivery_date_iso,
    delivery_instruction: deliveryInstruction,
    coupon_code: couponCode || null,
    address,
  };

  const params = {
    ...basePayload,
    estore_order_checkout: basePayload,
  };

  const res = await axiosConfig.post(
    "/api/v2/bc/estore/estore_order_checkouts",
    params
  );
  return res.data;
}

export async function fetchOrders({ status, page }: { status: string; page: number }) {
  const params = {
    status: status,
    page: page,
  }
  const res = await axiosConfig.get("/api/v2/bc/estore/estore_onetime_orders", {params: params})
  return res.data
}
