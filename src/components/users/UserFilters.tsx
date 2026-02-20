import { Clock, UserCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type StatusFilter = "all" | "active" | "inactive";
export type VerificationFilter = "all" | "pending" | "accepted" | "rejected";

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const VERIFICATION_OPTIONS: { value: VerificationFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
];

function statusLabel(value: StatusFilter): string {
  return STATUS_OPTIONS.find((o) => o.value === value)?.label ?? "Status";
}

function verificationLabel(value: VerificationFilter): string {
  return VERIFICATION_OPTIONS.find((o) => o.value === value)?.label ?? "Profile";
}

interface FilterPopoverProps<T extends string> {
  icon: React.ReactNode;
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onValueChange: (value: T) => void;
  className?: string;
}

function FilterPopover<T extends string>({
  icon,
  label,
  value,
  options,
  onValueChange,
  className,
}: FilterPopoverProps<T>) {
  const currentLabel = options.find((o) => o.value === value)?.label ?? label;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-9 gap-1.5 rounded-md border-border bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground font-normal",
            className
          )}
        >
          {icon}
          <span>{currentLabel}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 rounded-lg border border-border bg-card p-3 shadow-md" align="start">
        <RadioGroup
          value={value}
          onValueChange={(v) => onValueChange(v as T)}
          className="grid gap-2"
        >
          {options.map((opt) => (
            <div key={opt.value} className="flex items-center gap-2">
              <RadioGroupItem value={opt.value} id={`${label}-${opt.value}`} />
              <Label
                htmlFor={`${label}-${opt.value}`}
                className="cursor-pointer text-sm font-normal text-foreground"
              >
                {opt.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </PopoverContent>
    </Popover>
  );
}

interface UserFiltersProps {
  statusFilter: StatusFilter;
  verificationFilter: VerificationFilter;
  onStatusChange: (value: StatusFilter) => void;
  onVerificationChange: (value: VerificationFilter) => void;
  className?: string;
}

export function UserFilters({
  statusFilter,
  verificationFilter,
  onStatusChange,
  onVerificationChange,
  className,
}: UserFiltersProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <FilterPopover
        icon={<Clock className="h-4 w-4 text-muted-foreground" />}
        label="Status"
        value={statusFilter}
        options={STATUS_OPTIONS}
        onValueChange={onStatusChange}
      />
      <FilterPopover
        icon={<UserCircle className="h-4 w-4 text-muted-foreground" />}
        label="Profile"
        value={verificationFilter}
        options={VERIFICATION_OPTIONS}
        onValueChange={onVerificationChange}
      />
    </div>
  );
}

export { statusLabel, verificationLabel };
