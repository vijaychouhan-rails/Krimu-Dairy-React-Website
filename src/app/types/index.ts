export type Category = {
    name: string;
    icon: String;
    category_image_url?: any;
}

export type Product = {
  id: number;
  price: number;
  gst_percentage: number | null;
  product_name: string;
  unit: string;
  position: number;
  detail: string;
  pic: string;
  empty_returnable: boolean;
  in_stock: boolean;
  cust_can_subscribe: boolean;
  cust_can_chg_subscribe: boolean;
  available_on_location: boolean;
  product_mrp: number | null;
  price_per_off: number | null;
  can_cancel_subscription: boolean;
  can_cust_order_book: boolean;
  can_estore_cust_onetime_order_book: boolean;
};

export type CategoryProduct = {
  id: number;
  category: string;
  products: Product[];
};

export type DashboardData = {
    meta: {
        current_page: number;
        next_page: number;
    },
    categories: any[];
    category_products: any[];
    top_message: string;
}

// Dashboard now reads latitude/longitude from Redux store instead of props

export type DeliveryStatus = "pending" | "delivered" | "cancelled";

export interface Order {
  id: number;
  order_no: string;
  delivery_date: string;
  delivery_status: DeliveryStatus;
  estimated_delivery_time: string | null;
  can_cancel_order: boolean;
  total_items: number;
}

export interface OrdersResponse {
  estore_onetime_orders: Order[];
  meta: {
    current_page: number;
    next_page: number | null;
  };
}

