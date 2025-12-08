import { Order } from "../../types";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { Calendar, Package, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { Card } from "../ui/card";

interface OrderCardProps {
  order: Order;
  onClick: () => void;
}

export const OrderCard = ({ order, onClick }: OrderCardProps) => {
  return (
    <Card
      onClick={onClick}
      className="p-6 mt-3 cursor-pointer transition-all duration-300 hover:shadow-lg border-border/50 hover:border-primary/30 bg-card"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-4">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h3 className="font-semibold text-lg text-foreground mb-1">
                Order #{order.order_no}
              </h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(order.delivery_date), "MMM dd, yyyy")}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Package className="h-4 w-4" />
                  <span>{order.total_items} {order.total_items === 1 ? "item" : "items"}</span>
                </div>
              </div>
            </div>
            <OrderStatusBadge status={order.delivery_status} />
          </div>

          {order.estimated_delivery_time && (
            <div className="text-sm text-muted-foreground">
              Estimated delivery: {order.estimated_delivery_time}
            </div>
          )}
        </div>

        <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
      </div>
    </Card>
  );
};