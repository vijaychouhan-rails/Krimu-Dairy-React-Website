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

  const handleCancelOrder = () => {
    if (onCancelOrder) {
      onCancelOrder(order.id);
    }
    toast.success(
      `Order #${order.order_no} has been cancelled successfully.`
    );
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Order Details</DialogTitle>
          <DialogDescription>
            Order #{order.order_no}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Status</span>
            <OrderStatusBadge status={order.delivery_status} />
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Delivery Date</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(order.delivery_date), "MMMM dd, yyyy")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Package className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Total Items</p>
                <p className="text-sm text-muted-foreground">
                  {order.total_items} {order.total_items === 1 ? "item" : "items"}
                </p>
              </div>
            </div>

            {order.estimated_delivery_time && (
              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Estimated Time</p>
                  <p className="text-sm text-muted-foreground">
                    {order.estimated_delivery_time}
                  </p>
                </div>
              </div>
            )}
          </div>

          {order.can_cancel_order && (
            <>
              <Separator />
              <Button
                variant="destructive"
                className="w-full gap-2"
                onClick={handleCancelOrder}
              >
                <X className="h-4 w-4" />
                Cancel Order
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
