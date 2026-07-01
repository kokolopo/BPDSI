"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { adminMenus, memberMenus, MenuItem } from "@/lib/permissions/menus";
import { hasPermission } from "@/lib/permissions/permissions";

interface RouteGuardProps {
  children: React.ReactNode;
}

export function RouteGuard({ children }: RouteGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !user) {
      router.replace("/login");
      return;
    }

    // Define route-to-permission mapping
    const routePermissions: Record<string, string> = {
      "/dashboard": "view:dashboard",
      "/master-data": "view:master_data",
      "/members": "read:members",
      "/registration": "read:registration",
      "/approval": "read:approval",
      "/mutation": "read:mutation",
      "/payments": "read:payments",
      "/letters": "read:letters",
      "/announcements": "read:announcements",
      "/users": "read:users",
      "/audit-log": "view:audit_log",
      "/reports": "read:reports",
      "/settings": "read:settings",
      "/member-card": "view:member_card",
      "/my-payment": "read:payments",
      "/my-documents": "view:member_document",
      "/membership-status": "view:membership_status",
      "/my-mutations": "view:member_mutations",
      "/my-letters": "view:member_letters",
      "/account-settings": "view:member_settings",
    };

    // Profile is accessible by anyone authenticated
    if (pathname.startsWith("/profile") || pathname === "/") {
      setIsAuthorized(true);
      return;
    }

    // Find matching base route (e.g., /master-data/branches -> /master-data)
    const matchedRoute = Object.keys(routePermissions)
      .sort((a, b) => b.length - a.length) // match longest prefix first
      .find(route => pathname.startsWith(route));

    if (!matchedRoute) {
      // If route is not protected by RBAC logic (e.g. some new route), we deny by default for safety
      setIsAuthorized(false);
      router.replace("/403");
      return;
    }

    let requiredPermission = routePermissions[matchedRoute] as any;
    
    // Special case for dashboard which has different permissions based on role
    if (matchedRoute === "/dashboard" && user.role === "anggota") {
      requiredPermission = "view:member_dashboard";
    }

    const accessGranted = hasPermission(user.role, requiredPermission);
    
    if (accessGranted) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
      router.replace("/403");
    }
  }, [isAuthenticated, user, pathname, router, isLoading]);

  if (isLoading || !isAuthorized) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}
