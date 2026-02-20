import { useEffect, useState } from "react";
import type { Interest } from "@/api/interests";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface InterestDrawerProps {
  open: boolean;
  onClose: () => void;
  interest: Interest | null;
  onSave: (data: { title: string; description?: string; isActive?: boolean }) => void;
}

export function InterestDrawer({ open, onClose, interest, onSave }: InterestDrawerProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (interest) {
      setTitle(interest.title);
      setDescription(interest.description ?? "");
      setIsActive(interest.isActive !== false);
    } else {
      setTitle("");
      setDescription("");
      setIsActive(true);
    }
    setErrors({});
  }, [interest, open]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = "Title is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({ title: title.trim(), description: description.trim() || undefined, isActive });
  };

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{interest ? "Edit Interest" : "Create Interest"}</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-6">
          <div className="space-y-2">
            <Label htmlFor="interest-title">Title</Label>
            <Input
              id="interest-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Music, Travel"
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="interest-description">Description (optional)</Label>
            <Textarea
              id="interest-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description"
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="interest-active">Active</Label>
            <Switch id="interest-active" checked={isActive} onCheckedChange={setIsActive} />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {interest ? "Save Changes" : "Create Interest"}
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
