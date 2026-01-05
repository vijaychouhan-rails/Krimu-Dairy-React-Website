"use client";

import { useState } from "react";
import { Order } from "../../types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { X } from "lucide-react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { Textarea } from "../../components/ui/textarea";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchOrderDetails, fetchOrderStatuses, cancelOrder } from "@/services/orderService";

type OrderProduct = {
  id: number;
  product_name: string;
  quantity: number;
  unit?: string | null;
  price: number;
  total_amount?: number | null;
};

type OrderDeliveryAddress =
  | string
  | {
    full_address?: string | null;
    address?: string | null;
  };

type OrderDetails = Order & {
  order_products?: OrderProduct[];
  delivery_address?: OrderDeliveryAddress | null;
  sub_total_amount?: number | null;
  total_amount?: number | null;
  delivery_charge?: number | null;
  promo_discount?: number | null;
  total_payable_amount?: number | null;
  final_amount_to_pay?: number | null;
  paid_amount?: number | null;
  payment_mode?: string | null;
};

type OrderStatusItem = {
  status?: string | null;
  message?: string | null;
  created_at?: string | null;
  active?: boolean | null;
};
interface OrderDetailsDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancelOrder?: (orderId: number) => void;
}

export const OrderDetailsDialog = ({
  order,
  open,
  onOpenChange,
  onCancelOrder,
}: OrderDetailsDialogProps) => {
  const [cancelMessage, setCancelMessage] = useState("");

  const orderId = order?.id;

  const {
    data: orderDetails,
    isLoading: isDetailsLoading,
    isError: isDetailsError,
  } = useQuery({
    queryKey: ["ORDER_DETAILS", orderId],
    queryFn: () => (orderId ? fetchOrderDetails(orderId) : Promise.resolve(null)),
    enabled: !!orderId,
  });

  const {
    data: orderStatuses,
    isLoading: isStatusesLoading,
    isError: isStatusesError,
  } = useQuery({
    queryKey: ["ORDER_STATUSES", orderId],
    queryFn: () => (orderId ? fetchOrderStatuses(orderId) : Promise.resolve(null)),
    enabled: !!orderId,
  });

  const details: OrderDetails | null =
    (orderDetails &&
      (orderDetails as { estore_one_time_order?: OrderDetails }).estore_one_time_order) ||
    (orderDetails as OrderDetails | null) ||
    (order as OrderDetails | null);

  const statuses: OrderStatusItem[] =
    (orderStatuses &&
      (orderStatuses as { order_statuses?: OrderStatusItem[] }).order_statuses) ||
    (Array.isArray(orderStatuses) ? (orderStatuses as OrderStatusItem[]) : []);

  const queryClient = useQueryClient();

  const cancelMutation = useMutation({
    mutationFn: ({ message }: { message: string }) =>
      cancelOrder({ id: order!.id, message }),
    onSuccess: () => {
      if (onCancelOrder) {
        onCancelOrder(order!.id);
      }
      queryClient.invalidateQueries({ queryKey: ["GET_ORDERS"] });
      toast.success(
        `Order #${order!.order_no} has been cancelled successfully.`
      );
      setCancelMessage("");
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Failed to cancel order. Please try again.");
    },
  });

  if (!order) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] w-full h-[520px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">Order Details</DialogTitle>
          <DialogDescription>
            Order #{details?.order_no ?? order.order_no}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex-1 min-h-0 overflow-y-auto pr-1">
          <Tabs defaultValue="details">
            <TabsList>
              <TabsTrigger value="details">Order details</TabsTrigger>
              <TabsTrigger value="status">Status</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <div className="space-y-6 py-4">
                {isDetailsLoading && (
                  <p className="text-sm text-muted-foreground">Loading details...</p>
                )}
                {isDetailsError && (
                  <p className="text-sm text-red-500">Failed to load order details.</p>
                )}
                {!isDetailsLoading && !isDetailsError && details && (
                  <div className="space-y-6">
                    <div className="rounded-md border p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">
                          Order ID
                        </span>
                        <span className="text-sm font-semibold">
                          #{details.order_no}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">No of items</span>
                        <span>{details.order_products?.length ?? details.total_items}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Date</span>
                        <span>
                          {details.delivery_date
                            ? format(new Date(details.delivery_date), "MMMM dd, yyyy")
                            : format(new Date(order.delivery_date), "MMMM dd, yyyy")}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Status</span>
                        <OrderStatusBadge status={details.delivery_status ?? order.delivery_status} />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Payment type</span>
                        <span className="font-medium uppercase">
                          {details.payment_mode ?? "-"}
                        </span>
                      </div>
                    </div>

                    <div className="rounded-md border p-3 space-y-2 text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold">Delivery address</span>
                      </div>
                      {details.delivery_address ? (
                        <p className="text-sm break-words">
                          {typeof details.delivery_address === "string"
                            ? details.delivery_address
                            : details.delivery_address.full_address ??
                            details.delivery_address.address ??
                            ""}
                        </p>
                      ) : (
                        <p className="text-muted-foreground">No delivery address available.</p>
                      )}
                    </div>

                    <div className="rounded-md border p-3 space-y-2 text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold">Products</span>
                        <span className="text-xs text-muted-foreground">
                          {details.order_products?.length ?? 0} items
                        </span>
                      </div>
                      {details.order_products && details.order_products.length > 0 ? (
                        <div className="space-y-2 max-h-48 overflow-auto">
                          {details.order_products.map((p: OrderProduct) => (
                            <div
                              key={p.id}
                              className="flex justify-between items-start gap-3 border-b last:border-b-0 pb-1"
                            >
                              <div className="flex-1">
                                <div className="font-medium">{p.product_name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {p.quantity} {p.unit} x ₹{p.price}
                                </div>
                              </div>
                              <div className="text-sm font-semibold whitespace-nowrap">
                                ₹{p.total_amount ?? p.price * p.quantity}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No products found.</p>
                      )}
                    </div>

                    <div className="rounded-md border p-3 space-y-1 text-sm">
                      <span className="font-semibold">Payment info</span>
                      <p className="text-muted-foreground text-xs leading-relaxed">
                        Payment type {details.payment_mode ?? "-"}. Subtotal ₹
                        {details.sub_total_amount ?? details.total_amount}. Delivery charge ₹
                        {details.delivery_charge ?? 0}. Promo discount ₹
                        {details.promo_discount ?? 0}. Total payable amount ₹
                        {details.total_payable_amount ?? details.final_amount_to_pay ?? details.total_amount}.
                        Paid amount ₹{details.paid_amount ?? 0}.
                      </p>
                    </div>

                    {order.can_cancel_order && (
                      <div className="pt-2" />
                    )}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="status">
              <div className="space-y-4 py-4">
                {isStatusesLoading && (
                  <p className="text-sm text-muted-foreground">Loading status...</p>
                )}
                {isStatusesError && (
                  <p className="text-sm text-red-500">Failed to load status.</p>
                )}
                {!isStatusesLoading && !isStatusesError && statuses.length > 0 && (
                  <div className="space-y-2 text-sm">
                    {statuses.map((status: OrderStatusItem, index: number) => {
                      const isActive = !!status.active;
                      const cardClasses = isActive
                        ? "border-green-200 bg-green-50"
                        : "border-yellow-200 bg-yellow-50";

                      return (
                        <div
                          key={index}
                          className={`rounded-md border p-2 flex flex-col gap-1 ${cardClasses}`}
                        >
                          {status.status && (
                            <span className="font-medium capitalize">
                              {status.status.replace(/_/g, " ")}
                            </span>
                          )}
                          {status.message && (
                            <span className="text-xs text-muted-foreground">
                              {status.message}
                            </span>
                          )}
                          {status.created_at && (
                            <span className="text-[11px] text-muted-foreground">
                              {status.created_at}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {order.can_cancel_order && (
          <div className="mt-3 border-t pt-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="w-full gap-2"
                  disabled={cancelMutation.isPending}
                >
                  <X className="h-4 w-4" />
                  {cancelMutation.isPending ? "Cancelling..." : "Cancel Order"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel Order</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to cancel this order? You can provide a reason
                    for cancellation below.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-2">
                  <Textarea
                    placeholder="Reason for cancellation (optional)"
                    value={cancelMessage}
                    onChange={(e) => setCancelMessage(e.target.value)}
                    rows={3}
                  />
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={cancelMutation.isPending}>
                    No
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() =>
                      cancelMutation.mutate({ message: cancelMessage.trim() })
                    }
                    disabled={cancelMutation.isPending}
                  >
                    Yes, cancel
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
