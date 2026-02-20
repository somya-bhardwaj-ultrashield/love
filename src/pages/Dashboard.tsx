import { Users, UserCheck, UserX, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getUsers } from "@/lib/data";

export default function Dashboard() {
  const users = getUsers();
  const activeUsers = users.filter((u) => u.status === "Active").length;
  const inactiveUsers = users.filter((u) => u.status === "Inactive").length;
  const adminCount = users.filter((u) => u.role === "Admin").length;

  const stats = [
    { label: "Total Users", value: users.length, icon: Users, color: "text-primary" },
    { label: "Active Users", value: activeUsers, icon: UserCheck, color: "text-success" },
    { label: "Inactive Users", value: inactiveUsers, icon: UserX, color: "text-destructive" },
    { label: "Admins", value: adminCount, icon: Shield, color: "text-info" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
        <p className="text-muted-foreground mt-1">Here's an overview of your admin panel.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className="h-11 w-11 rounded-lg bg-accent flex items-center justify-center">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
