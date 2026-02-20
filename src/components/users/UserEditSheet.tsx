import { useEffect, useState } from "react";
import type { AdminUser, VerificationStatus } from "@/api/users";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserEditSheetProps {
  open: boolean;
  onClose: () => void;
  user: AdminUser | null;
  onSave: (id: string, data: { firstName?: string; lastName?: string; verificationStatus?: VerificationStatus; isBlocked?: boolean }) => Promise<void>;
}

export function UserEditSheet({ open, onClose, user, onSave }: UserEditSheetProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>("pending");
  const [isBlocked, setIsBlocked] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName ?? "");
      setLastName(user.lastName ?? "");
      setVerificationStatus((user.verificationStatus as VerificationStatus) ?? "pending");
      setIsBlocked(user.isBlocked ?? false);
    }
    setSaving(false);
  }, [user, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      await onSave(user._id, {
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
        verificationStatus,
        isBlocked,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit User</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="edit-firstName">First name</Label>
              <Input
                id="edit-firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-lastName">Last name</Label>
              <Input
                id="edit-lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Profile status</Label>
            <Select
              value={verificationStatus}
              onValueChange={(v) => setVerificationStatus(v as VerificationStatus)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Account status</Label>
            <Select
              value={isBlocked ? "inactive" : "active"}
              onValueChange={(v) => setIsBlocked(v === "inactive")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1" disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
