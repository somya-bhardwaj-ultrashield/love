import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { AppNavbar } from "./AppNavbar";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full">
      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-in-out ${
          sidebarOpen ? "w-60" : "w-16"
        }`}
      >
        <AppSidebar collapsed={!sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      </aside>

      {/* Mobile sidebar via sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0 bg-sidebar">
          <AppSidebar collapsed={false} onToggle={() => setMobileOpen(false)} mobile />
        </SheetContent>
      </Sheet>

      <div className="flex flex-1 flex-col min-w-0">
        <AppNavbar
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onMobileMenu={() => setMobileOpen(true)}
        />
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
