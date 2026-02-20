import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Heart,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Shield,
  FileText,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobile?: boolean;
}

const navItems = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Users", path: "/users", icon: Users },
  { label: "Interests", path: "/interests", icon: Heart },
  { label: "Occupations", path: "/occupations", icon: Briefcase },
  {
    label: "CMS",
    icon: FileText,
    children: [
      { label: "About", path: "/cms/about" },
      { label: "T&C", path: "/cms/terms" },
      { label: "Privacy", path: "/cms/privacy" },
    ],
  },
];

export function AppSidebar({ collapsed, onToggle, mobile }: AppSidebarProps) {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  // Auto-open CMS when inside /cms/*
  useEffect(() => {
    if (location.pathname.startsWith("/cms")) {
      setOpenMenu("CMS");
    }
  }, [location.pathname]);

  return (
    <div className="flex flex-col h-full">
      {/* Logo area */}
      <div
        className={cn(
          "flex items-center border-b border-sidebar-border h-14 px-3",
          collapsed && !mobile ? "justify-center" : "justify-between"
        )}
      >
        {(!collapsed || mobile) && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sidebar-foreground text-sm">
              Love Today
            </span>
          </div>
        )}

        {!mobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-3 px-2 space-y-1">
        {navItems.map((item) => {
          const hasChildren = "children" in item;

          // ---------- CMS WITH SUBMENU ----------
          if (hasChildren) {
            const isOpen = openMenu === item.label;

            return (
              <div key={item.label}>
                <button
                  onClick={() =>
                    setOpenMenu(isOpen ? null : item.label)
                  }
                  className="w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 shrink-0" />
                    {(!collapsed || mobile) && (
                      <span>{item.label}</span>
                    )}
                  </div>

                  {(!collapsed || mobile) && (
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform",
                        isOpen && "rotate-180"
                      )}
                    />
                  )}
                </button>

                {isOpen && (!collapsed || mobile) && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.children.map((sub) => {
                      const isActive =
                        location.pathname === sub.path;

                      return (
                        <NavLink
                          key={sub.path}
                          to={sub.path}
                          onClick={mobile ? onToggle : undefined}
                          className={cn(
                            "block rounded-md px-3 py-2 text-sm transition-colors",
                            isActive
                              ? "bg-sidebar-accent text-accent-foreground"
                              : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                          )}
                        >
                          {sub.label}
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          // ---------- NORMAL MENU ----------
          const isActive =
            item.path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.path);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={mobile ? onToggle : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5 shrink-0",
                  isActive && "text-primary"
                )}
              />
              {(!collapsed || mobile) && (
                <span>{item.label}</span>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}