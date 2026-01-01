import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { DeliveryStatus } from "../../types";

interface OrderFiltersProps {
  activeFilter: {status: "all" | DeliveryStatus};
  handlestatus: (filter: "all" | DeliveryStatus) => void;
  counts?: {
    all: number;
    pending: number;
    delivered: number;
    cancelled: number;
  };
}

export const OrderFilters = ({ activeFilter, handlestatus }: OrderFiltersProps) => {
  return (
    <Tabs value={activeFilter.status} onValueChange={(v) => handlestatus(v as "all" | DeliveryStatus)}>
      <TabsList className="grid w-full grid-cols-4 h-auto">
        <TabsTrigger value="all" className="gap-2">
          All
          {/* <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-semibold">
            {counts.all}
          </span> */}
        </TabsTrigger>
        <TabsTrigger value="pending" className="gap-2">
          Pending
          {/* <span className="bg-warning/10 text-warning px-2 py-0.5 rounded-full text-xs font-semibold">
            {counts.pending}
          </span> */}
        </TabsTrigger>
        <TabsTrigger value="confirmed" className="gap-2">
          Confirmed
        </TabsTrigger>
        <TabsTrigger value="delivered" className="gap-2">
          Delivered
          {/* <span className="bg-success/10 text-success px-2 py-0.5 rounded-full text-xs font-semibold">
            {counts.delivered}
          </span> */}
        </TabsTrigger>
        <TabsTrigger value="declined" className="gap-2">
          Declined
        </TabsTrigger>
        <TabsTrigger value="cancelled" className="gap-2">
          Cancelled
          {/* <span className="bg-destructive/10 text-destructive px-2 py-0.5 rounded-full text-xs font-semibold">
            {counts.cancelled}
          </span> */}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
