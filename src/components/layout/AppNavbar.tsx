import { useLocation, useNavigate } from "react-router-dom";
import { Menu, Bell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getCurrentUser } from "@/lib/data";


interface AppNavbarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onMobileMenu: () => void;
}

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/users": "Users",
  "/interests": "Interests",
  "/occupations": "Occupations",
  "/cms/about": "About Us",
  "/cms/privacy": "Privacy",
  "/cms/terms": "T&C",
};

export function AppNavbar({ onToggleSidebar, onMobileMenu }: AppNavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const title = pageTitles[location.pathname] ?? "Page";
  const currentUser = getCurrentUser();
  

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-9 w-9"
          onClick={onMobileMenu}
        >
          <Menu className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Bell className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => { localStorage.removeItem("auth_token"); navigate("/login"); }} title="Sign out">
          <LogOut className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {[currentUser.firstName?.[0], currentUser.lastName?.[0]].filter(Boolean).join("") || "?"}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block">
            <p className="text-sm font-medium leading-none">{[currentUser.firstName, currentUser.lastName].filter(Boolean).join(" ")}</p>
            <p className="text-xs text-muted-foreground">{currentUser.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
