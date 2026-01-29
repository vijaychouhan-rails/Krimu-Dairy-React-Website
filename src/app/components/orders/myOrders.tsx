"use client";
import { useState } from "react";
import { Order, DeliveryStatus } from "../../types";
import { OrderCard } from "../../components/orders/OrderCard";
import { OrderDetailsDialog } from "../../components/orders/OrderDetailsDialog";
import { OrderFilters } from "../../components/orders/OrderFilters";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchOrders } from "@/services/orderService";
import showErrorMessages from "@/lib/errorHandle";
import { useRouter } from "next/navigation";
import InfiniteScroll from "react-infinite-scroll-component";
import { Button } from "../ui/button";

const defaultValue: { status: "all" | DeliveryStatus } = {
  status: "all",
};

const MyOrders = () => {
  const router = useRouter();
  const [, setOrders] = useState<Order[]>([]);
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

  const { data, fetchNextPage, hasNextPage, isError, error, isLoading } = useInfiniteQuery(
    {
      queryKey: ["GET_ORDERS", JSON.stringify(activeFilter)],
      queryFn: ({ pageParam = 1 }) => fetchOrders({ status: activeFilter.status, page: pageParam }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => lastPage?.meta?.next_page ?? undefined,
      retry: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    }
  );

  const filteredOrders =
    data?.pages.flatMap((page) => page.estore_onetime_orders) ?? [];

  if (isError) {
    const axiosError = error as { response?: { data?: { errors?: string[] } } } | null;
    showErrorMessages({ error: axiosError?.response?.data?.errors });
    router.replace("/");
  }

  const handlestatus = (value: "all" | DeliveryStatus) => {
    setActiveFilter({ status: value });
  };

  return (
    !isError && (
      <div className="min-h-screen bg-muted/20">
        {/* Header Section */}
        <div className="bg-white border-b border-border/40 sticky top-0 z-10 backdrop-blur-xl bg-white/80 supports-[backdrop-filter]:bg-white/60">
          <div className="container mx-auto px-4 py-4 max-w-5xl">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="-ml-2 hover:bg-primary/5 hover:text-primary rounded-full"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  My Orders
                </h1>
                <p className="text-sm text-muted-foreground">
                  Track and manage your purchases
                </p>
              </div>
            </div>

            <div className="mt-6">
              <OrderFilters
                activeFilter={activeFilter}
                handlestatus={handlestatus}
              />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-5xl">
          {isLoading && filteredOrders.length === 0 ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 rounded-xl bg-muted/40 animate-pulse" />
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 px-4 text-center animate-in fade-in zoom-in duration-500">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                <div className="relative bg-background p-6 rounded-full shadow-lg border border-border/50">
                  <ShoppingBag className="h-10 w-10 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                No orders found
              </h3>
              <p className="text-muted-foreground max-w-xs mx-auto mb-8">
                {activeFilter.status === "all"
                  ? "Looks like you haven't placed any orders yet. Start shopping to fill this page!"
                  : `You have no ${activeFilter.status} orders at the moment.`}
              </p>
              <Button onClick={() => router.push('/')} className="rounded-full px-8 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-0.5">
                Start Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
              <InfiniteScroll
                dataLength={filteredOrders.length}
                next={fetchNextPage}
                hasMore={!!hasNextPage}
                loader={
                  <div className="py-8 flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                }
                className="space-y-4 !overflow-visible"
              >
                {filteredOrders.map((order, index) => (
                  <div key={order.id} style={{ animationDelay: `${index * 50}ms` }} className="animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-backwards">
                    <OrderCard
                      order={order}
                      onClick={() => handleOrderClick(order)}
                    />
                  </div>
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
