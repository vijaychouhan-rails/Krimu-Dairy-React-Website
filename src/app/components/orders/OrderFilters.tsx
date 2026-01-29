import { DeliveryStatus } from "../../types";
import { cn } from "@/lib/utils";

interface OrderFiltersProps {
  activeFilter: { status: "all" | DeliveryStatus };
  handlestatus: (filter: "all" | DeliveryStatus) => void;
  counts?: { [key: string]: number };
}

export const OrderFilters = ({ activeFilter, handlestatus }: OrderFiltersProps) => {
  const filters: { label: string; value: "all" | DeliveryStatus }[] = [
    { label: "All Orders", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Delivered", value: "delivered" },
    { label: "Cancelled", value: "cancelled" },
    { label: "Declined", value: "declined" },
  ];

  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
      <div className="flex items-center gap-2 min-w-max p-1">
        {filters.map((filter) => {
          const isActive = activeFilter.status === filter.value;
          return (
            <button
              key={filter.value}
              onClick={() => handlestatus(filter.value)}
              className={cn(
                "relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 ring-2 ring-primary ring-offset-2 ring-offset-background"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
