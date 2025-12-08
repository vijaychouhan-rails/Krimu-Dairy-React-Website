"use client";
import { useEffect, useState } from "react";
import { Order, DeliveryStatus } from "../../types";
import { OrderCard } from "../../components/orders/OrderCard";
import { OrderDetailsDialog } from "../../components/orders/OrderDetailsDialog";
import { OrderFilters } from "../../components/orders/OrderFilters";
import { ShoppingBag } from "lucide-react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchOrders } from "@/services/orderService";
import showErrorMessages from "@/lib/errorHandle";
import { useRouter } from "next/navigation";
import InfiniteScroll from "react-infinite-scroll-component";
import dynamic from "next/dynamic";

// Sample data from your API
const mockData = {
  estore_onetime_orders: [
    {
      id: 93,
      order_no: "20257423",
      delivery_date: "2025-10-10",
      delivery_status: "pending" as const,
      estimated_delivery_time: null,
      can_cancel_order: true,
      total_items: 1,
    },
    {
      id: 92,
      order_no: "20250524",
      delivery_date: "2025-10-10",
      delivery_status: "pending" as const,
      estimated_delivery_time: null,
      can_cancel_order: true,
      total_items: 1,
    },
    {
      id: 91,
      order_no: "20256530",
      delivery_date: "2025-10-10",
      delivery_status: "pending" as const,
      estimated_delivery_time: null,
      can_cancel_order: true,
      total_items: 1,
    },
    {
      id: 94,
      order_no: "20255655",
      delivery_date: "2025-10-04",
      delivery_status: "pending" as const,
      estimated_delivery_time: null,
      can_cancel_order: true,
      total_items: 1,
    },
    {
      id: 88,
      order_no: "20256857",
      delivery_date: "2025-10-02",
      delivery_status: "cancelled" as const,
      estimated_delivery_time: null,
      can_cancel_order: false,
      total_items: 1,
    },
  ],
  meta: {
    current_page: 1,
    next_page: 2,
  },
};

const defaultValue: { status: "all" | DeliveryStatus } = {
  status: "all",
};

const MyOrders = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>(mockData.estore_onetime_orders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState(defaultValue);

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  const handleCancelOrder = (orderId: number) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              delivery_status: "cancelled" as const,
              can_cancel_order: false,
            }
          : order
      )
    );
  };

//   const counts = {
//     all: orders.length,
//     pending: orders.filter((o) => o.delivery_status === "pending").length,
//     delivered: orders.filter((o) => o.delivery_status === "delivered").length,
//     cancelled: orders.filter((o) => o.delivery_status === "cancelled").length,
//   };

  const { data, fetchNextPage, hasNextPage, isError, error } = useInfiniteQuery(
    {
      queryKey: ["GET_ORDERS", JSON.stringify(activeFilter)],
      queryFn: ({pageParam=1}) => fetchOrders({status: activeFilter.status, page: pageParam}),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => lastPage?.meta?.next_page ?? undefined,
      retry: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    }
  );

  const filteredOrders =
    data?.pages.flatMap((page) => page.estore_onetime_orders) ?? [];
  
  // const filteredOrders = estoreOrders.filter((order) =>
  //   activeFilter === "all" ? true : order.delivery_status === activeFilter
  // );

  if (isError) {
    const axiosError = error as any;
    showErrorMessages({ error: axiosError?.response?.data?.errors });
    router.replace("/");
  }

  const handlestatus = (value: "all" | DeliveryStatus) => {
    setActiveFilter({status: value})
  }

  return (
    !isError && (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="mb-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <ShoppingBag className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground">
                  My Orders
                </h1>
                <p className="text-muted-foreground mt-1">
                  Track and manage your orders
                </p>
              </div>
            </div>

            <OrderFilters
              activeFilter={activeFilter}
              handlestatus={handlestatus}
            />
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
                <ShoppingBag className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No orders found
              </h3>
              <p className="text-muted-foreground">
                {activeFilter.status === "all"
                  ? "You haven't placed any orders yet."
                  : `You have no ${activeFilter} orders.`}
              </p>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
                <InfiniteScroll
                    dataLength={filteredOrders.length}
                    next={fetchNextPage}
                    hasMore={!!hasNextPage}
                    loader={<h4 className="text-center">Loading more products...</h4>}
                    endMessage={
                        <p className="text-center mt-4">
                        <b>All Orders loaded!</b>
                        </p>
                    }
                >
                    {filteredOrders.map((order) => (
                        <OrderCard
                        key={order.id}
                        order={order}
                        onClick={() => handleOrderClick(order)}
                        />
                    ))}
                </InfiniteScroll>
            </div>
          )}

          <OrderDetailsDialog
            order={selectedOrder}
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            onCancelOrder={handleCancelOrder}
          />
        </div>
      </div>
    )
  );
};

export default MyOrders;
