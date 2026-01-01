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
import { Calendar, Package, Truck, X } from "lucide-react";
import { format } from "date-fns";
import { Separator } from "../../components/ui/separator";
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
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchOrderDetails, fetchOrderStatuses, cancelOrder } from "@/services/orderService";
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
  if (!order) return null;
  const [cancelMessage, setCancelMessage] = useState("");

  const {
    data: orderDetails,
    isLoading: isDetailsLoading,
    isError: isDetailsError,
  } = useQuery({
    queryKey: ["ORDER_DETAILS", order.id],
    queryFn: () => fetchOrderDetails(order.id),
    enabled: !!order.id,
  });

  const {
    data: orderStatuses,
    isLoading: isStatusesLoading,
    isError: isStatusesError,
  } = useQuery({
    queryKey: ["ORDER_STATUSES", order.id],
    queryFn: () => fetchOrderStatuses(order.id),
    enabled: !!order.id,
  });

  const details: any =
    (orderDetails as any)?.estore_one_time_order || orderDetails || order;

  const statuses: any[] =
    ((orderStatuses as any)?.order_statuses as any[]) ||
    ((Array.isArray(orderStatuses) ? orderStatuses : []) as any[]);

  const cancelMutation = useMutation({
    mutationFn: ({ message }: { message: string }) =>
      cancelOrder({ id: order.id, message }),
    onSuccess: () => {
      if (onCancelOrder) {
        onCancelOrder(order.id);
      }
      toast.success(
        `Order #${order.order_no} has been cancelled successfully.`
      );
      setCancelMessage("");
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Failed to cancel order. Please try again.");
    },
  });

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
                        {(details.delivery_address as any).full_address ??
                          (details.delivery_address as any).address ??
                          String(details.delivery_address)}
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
                        {details.order_products.map((p: any) => (
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
                  {statuses.map((status: any, index: number) => {
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
