import { Pencil, Trash2, MoreHorizontal } from "lucide-react";
import type { AdminUser } from "@/api/users";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

interface UserTableProps {
  users: AdminUser[];
  canUpdate: boolean;
  canDelete: boolean;
  onEdit: (user: AdminUser) => void;
  onDelete: (user: AdminUser) => void;
}

function displayName(user: AdminUser): string {
  const first = user.firstName?.trim();
  const last = user.lastName?.trim();
  if (first || last) return [first, last].filter(Boolean).join(" ");
  return user.phoneNumber ?? "—";
}

function formatDate(d: string | undefined): string {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString();
  } catch {
    return "—";
  }
}

function verificationBadgeVariant(status: string | undefined): "default" | "secondary" | "outline" {
  switch (status) {
    case "accepted":
      return "default";
    case "rejected":
      return "outline";
    default:
      return "secondary";
  }
}

export function UserTable({ users, canUpdate, canDelete, onEdit, onDelete }: UserTableProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="space-y-3">
        {users.map((user) => (
          <Card key={user._id} className="border-border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="font-medium text-foreground">{displayName(user)}</p>
                  <p className="text-sm text-muted-foreground">{user.phoneNumber ?? "—"}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <Badge
                      variant={verificationBadgeVariant(user.verificationStatus)}
                      className="text-xs capitalize"
                    >
                      {user.verificationStatus ?? "—"}
                    </Badge>
                    <Badge
                      variant={user.isBlocked ? "outline" : "default"}
                      className="text-xs"
                    >
                      {user.isBlocked ? "Inactive" : "Active"}
                    </Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {canUpdate && (
                      <DropdownMenuItem onClick={() => onEdit(user)}>
                        <Pencil className="w-4 h-4 mr-2" /> Edit
                      </DropdownMenuItem>
                    )}
                    {canDelete && (
                      <DropdownMenuItem onClick={() => onDelete(user)} className="text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <Card className="border-border shadow-sm overflow-hidden">
      <div className="overflow-x-auto scrollbar-thin">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Profile</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-medium">{displayName(user)}</TableCell>
                <TableCell className="text-muted-foreground">{user.phoneNumber ?? "—"}</TableCell>
                <TableCell>
                  <Badge
                    variant={verificationBadgeVariant(user.verificationStatus)}
                    className="capitalize"
                  >
                    {user.verificationStatus ?? "—"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.isBlocked ? "outline" : "default"}>
                    {user.isBlocked ? "Inactive" : "Active"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{formatDate(user.createdAt)}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    {canUpdate && (
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(user)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                    )}
                    {canDelete && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => onDelete(user)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
