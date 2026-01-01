import { Badge } from "../../components/ui/badge";
import { DeliveryStatus } from "../../types";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

interface OrderStatusBadgeProps {
  status: DeliveryStatus;
}

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  const statusConfig: Record<DeliveryStatus, {
    label: string;
    variant: "warning" | "success" | "destructive" | "default" | "secondary" | "outline";
    icon: typeof Clock | typeof CheckCircle2 | typeof XCircle;
  }> = {
    pending: {
      label: "Pending",
      variant: "warning",
      icon: Clock,
    },
    pg_payment_pending: {
      label: "Payment Pending",
      variant: "outline",
      icon: Clock,
    },
    confirmed: {
      label: "Confirmed",
      variant: "success",
      icon: CheckCircle2,
    },
    delivered: {
      label: "Delivered",
      variant: "success",
      icon: CheckCircle2,
    },
    declined: {
      label: "Declined",
      variant: "destructive",
      icon: XCircle,
    },
    cancelled: {
      label: "Cancelled",
      variant: "destructive",
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