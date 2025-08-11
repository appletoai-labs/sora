"use client";

import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { DashboardSidebar } from "./DashboardSidebar";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SupportCard } from "@/components/dashboard/shared/supportcard";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import ScrollToTop from "../ScrollToTop";

export const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  const handleLogout = () => logout();

  // Prevent scroll when sidebar is open on mobile
  useEffect(() => {
    if (mobileSidebarOpen && (isMobile || isTablet)) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileSidebarOpen, isMobile, isTablet]);

  // Collapse sidebar by default on tablets
  useEffect(() => {
    if (isTablet && !isMobile) {
      setSidebarCollapsed(true); // collapsed on tablet
    } else {
      setSidebarCollapsed(false); // expanded on desktop
    }

    if (!isTablet) {
      setMobileSidebarOpen(false); // auto-close mobile drawer on desktop
    }
  }, [isTablet, isMobile]);

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      <ScrollToTop />

      <DashboardSidebar
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
        isTablet={isTablet}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-gradient-to-r from-sora-card to-sora-muted border-b border-border px-4 py-4 relative z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {(isMobile || isTablet) && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (isMobile) {
                      setMobileSidebarOpen(true);
                    } else {
                      setSidebarCollapsed(!sidebarCollapsed);
                    }
                  }}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              )}

              <h1 className="text-2xl font-bold bg-gradient-to-r from-sora-teal to-sora-orange bg-clip-text text-transparent">
                Dashboard
              </h1>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                  <User className="h-4 w-4" />
                  {user?.firstName} {user?.lastName}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator /> */}
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-6 py-6 space-y-8 custom-scroll">
          <Outlet />
          {user && <SupportCard user={user} />}
        </main>
      </div>
    </div>
  );
};
