"use client";

import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home, MessageCircle, Lightbulb, FileText, Calendar,
  Hand, Target, List, Users, BarChart3, ChevronLeft, ChevronRight,
  Activity, HeartPulse, AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SoraLogo from "../SoraLogo";

const sidebarItems = [
  {
    title: "CORE TOOLS",
    items: [
      { name: "Home", href: "/app", icon: Home },
      { name: "Chat with SORA", href: "/app/chat", icon: MessageCircle },
      { name: "Clarity Tools", href: "/app/clarity", icon: Lightbulb },
      { name: "Daily Check-in", href: "/app/checkin", icon: Calendar },
    ],
  },
  {
    title: "SUPPORT",
    items: [
      { name: "Sensory Support", href: "/app/sensory", icon: Hand },
      { name: "Goals & Progress", href: "/app/goals", icon: Target },
      { name: "Executive Function", href: "/app/executive", icon: List },
      { name: "Community", href: "/app/community", icon: Users },
    ],
  },
  {
    title: "ANALYTICS",
    items: [
      { name: "Dashboard", href: "/app/dashboard", icon: BarChart3 },
      { name: "RealLife Mode", href: "/app/reallife", icon: Activity },
    ],
  },
  {
    title: "EMERGENCY",
    items: [
      { name: "Emotional Support", href: "/app/emotional-support", icon: HeartPulse },
      { name: "Crisis Support", href: "/app/immediate-support", icon: AlertTriangle },
    ],
  },
];

export const DashboardSidebar = ({
  mobileOpen,
  setMobileOpen,
  isTablet,
  collapsed,
  setCollapsed,
}: {
  mobileOpen: boolean;
  setMobileOpen: (val: boolean) => void;
  isTablet: boolean;
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
}) => {
  const location = useLocation();

  const SidebarContent = () => (
    <div
      className={cn(
        "h-full flex flex-col bg-gradient-to-b from-sora-dark to-sora-card border-r border-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && <SoraLogo />}
        {!isTablet && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="text-muted-foreground hover:text-foreground hidden lg:block"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        )}
      </div>

      {/* Items */}
      <div
        className={cn(
          "flex-1 overflow-y-auto p-4 pb-10 custom-scroll"
        )}
      >

        {sidebarItems.map((section) => (
          <div key={section.title} className="mb-6">
            {!collapsed && (
              <h3 className="text-xs font-semibold text-sora-teal uppercase tracking-wider mb-3">
                {section.title}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                      "hover:bg-sora-muted hover:text-foreground",
                      isActive
                        ? "bg-gradient-to-r from-sora-teal/20 to-sora-orange/20 text-sora-teal border border-sora-teal/30"
                        : "text-muted-foreground",
                      collapsed && "justify-center"
                    )}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    {!collapsed && <span>{item.name}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Sidebar for tablet and up */}
      <div className={cn("hidden", isTablet ? "md:flex" : "lg:flex")}>
        <SidebarContent />
      </div>

      {/* Sidebar drawer for mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="w-64 max-w-full bg-sora-dark">
            <SidebarContent />
          </div>
          <div
            className="flex-1 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
        </div>
      )}
    </>
  );
};
