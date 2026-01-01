import { Badge } from "../../components/ui/badge";
import { DeliveryStatus } from "../../types";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

interface OrderStatusBadgeProps {
  status: DeliveryStatus;
}

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  const statusConfig = {
    pending: {
      label: "Pending",
      variant: "warning" as const,
      icon: Clock,
    },
    pg_payment_pending: {
      label: "Payment Pending",
      variant: "ghost" as const,
      icon: Clock,
    },
    delivered: {
      label: "Delivered",
      variant: "success" as const,
      icon: CheckCircle2,
    },
    cancelled: {
      label: "Cancelled",
      variant: "destructive" as const,
      icon: XCircle,
    },
  };

  const config = statusConfig[status];
  const Icon = config?.icon;

  return Icon && (
    <Badge variant={config.variant} className="gap-1.5">
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </Badge>
  );
};