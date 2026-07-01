"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { APP_NAME, APP_FULL_NAME } from "@/constants/menu";
import { getMenusForRole, MenuItem } from "@/lib/permissions/menus";
import { useAuthStore } from "@/stores/auth.store";
import { hasPermission } from "@/lib/permissions/permissions";
import { ChevronDown, ChevronLeft, PanelLeftClose, PanelLeft } from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const toggleSubmenu = (id: string) => {
    setExpandedMenus((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard" || pathname === "/";
    return pathname.startsWith(href);
  };

  const allowedMenus = useMemo(() => {
    if (!user) return [];
    // Currently, our dynamic menu is flat, but we could add submenus in the future.
    // For now, we fetch the available menus based on role, then filter by specific permissions.
    const allRoleMenus = getMenusForRole(user.role, 1); // pass user.role
    return allRoleMenus.filter(menu => hasPermission(user.role, menu.permission));
  }, [user]);

  const renderMenuItem = (item: any) => {
    const active = isActive(item.path); // our menus use 'path' instead of 'href'
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedMenus.includes(item.id);

    if (hasChildren) {
      return (
        <div key={item.id}>
          <button
            onClick={() => toggleSubmenu(item.id)}
            className={cn(
              "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
              active
                ? "bg-gradient-to-r from-blue-600/20 to-indigo-600/10 text-blue-400"
                : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
            )}
          >
            <item.icon className={cn("h-5 w-5 shrink-0", active ? "text-blue-400" : "text-zinc-500 group-hover:text-zinc-300")} />
            {!collapsed && (
              <>
                <span className="flex-1 text-left">{item.title}</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    isExpanded && "rotate-180"
                  )}
                />
              </>
            )}
          </button>
          {!collapsed && isExpanded && (
            <div className="mt-1 ml-4 space-y-0.5 border-l border-zinc-800 pl-4">
              {item.children!.map((child: any) => (
                <Link
                  key={child.id}
                  href={child.path}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200",
                    isActive(child.path)
                      ? "bg-blue-600/10 text-blue-400 font-medium"
                      : "text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300"
                  )}
                >
                  <span className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    isActive(child.path) ? "bg-blue-400" : "bg-zinc-600"
                  )} />
                  <span>{child.title}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.id}
        href={item.path}
        className={cn(
          "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
          active
            ? "bg-gradient-to-r from-blue-600/20 to-indigo-600/10 text-blue-400 shadow-sm shadow-blue-500/5"
            : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
        )}
      >
        <div className={cn(
          "flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-200",
          active
            ? "bg-blue-600/20 text-blue-400"
            : "text-zinc-500 group-hover:text-zinc-300"
        )}>
          <item.icon className="h-[18px] w-[18px]" />
        </div>
        {!collapsed && <span>{item.title}</span>}
        {!collapsed && item.badge && (
          <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[10px] font-bold text-white">
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-zinc-800/50 bg-zinc-950 transition-all duration-300",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-zinc-800/50 px-4">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-600/20">
            <span className="text-sm font-bold text-white">SP</span>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-wide text-white">
                {APP_NAME}
              </span>
              <span className="text-[10px] text-zinc-500">
                {APP_FULL_NAME.length > 30 ? "Admin Serikat Pekerja" : APP_FULL_NAME}
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        {allowedMenus.map(renderMenuItem)}
      </nav>

      {/* Collapse Toggle */}
      <div className="border-t border-zinc-800/50 p-3">
        <button
          onClick={onToggle}
          className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm text-zinc-500 transition-all hover:bg-zinc-800/50 hover:text-zinc-300"
        >
          {collapsed ? (
            <PanelLeft className="h-5 w-5" />
          ) : (
            <>
              <PanelLeftClose className="h-5 w-5" />
              <span>Collapse</span>
              <ChevronLeft className="ml-auto h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
