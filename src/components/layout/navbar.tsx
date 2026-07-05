"use client";

import { usePathname, useRouter } from "next/navigation";
import { Bell, LogOut, Search, User, ChevronRight, Menu } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { useAuthStore } from "@/stores/auth.store";
import { ROLE_LABELS } from "@/constants/menu";
import { adminMenus, memberMenus } from "@/lib/permissions/menus";
import { getInitials } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";

interface NavbarProps {
  sidebarCollapsed: boolean;
  onMobileMenuToggle: () => void;
}

export function Navbar({ sidebarCollapsed, onMobileMenuToggle }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Generate breadcrumb from pathname
  const getBreadcrumb = () => {
    const segments = pathname.split("/").filter(Boolean);
    const crumbs: { label: string; href: string }[] = [];

    const allMenus = [...adminMenus, ...memberMenus];

    let currentPath = "";
    for (const segment of segments) {
      currentPath += `/${segment}`;
      const menuItem = allMenus.find((m) => m.path === currentPath);
      const label = menuItem?.title || segment.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
      crumbs.push({ label, href: currentPath });
    }

    return crumbs;
  };

  const breadcrumb = getBreadcrumb();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header
      className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-200 bg-white/80 px-4 backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-900/80 sm:px-6 lg:ml-0"
      style={{ marginLeft: undefined }}
    >
      {/* Left: Hamburger + Breadcrumb */}
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMobileMenuToggle}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 transition-all hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <nav className="hidden items-center gap-1 text-sm sm:flex">
          {breadcrumb.map((crumb, index) => (
            <div key={crumb.href} className="flex items-center gap-1">
              {index > 0 && (
                <ChevronRight className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-600" />
              )}
              <span
                className={
                  index === breadcrumb.length - 1
                    ? "font-semibold text-zinc-900 dark:text-white"
                    : "text-zinc-500 dark:text-zinc-500"
                }
              >
                {crumb.label}
              </span>
            </div>
          ))}
        </nav>
        {/* Mobile: show only page title */}
        <span className="text-sm font-semibold text-zinc-900 dark:text-white sm:hidden">
          {breadcrumb.length > 0 ? breadcrumb[breadcrumb.length - 1].label : ""}
        </span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Search — hidden on very small screens */}
        <button className="hidden h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 transition-all hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100 sm:flex">
          <Search className="h-4 w-4" />
        </button>

        {/* Notifications */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 transition-all hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100">
          <Bell className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            3
          </span>
        </button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white py-1.5 pl-1.5 pr-2 transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 sm:gap-3 sm:pr-3"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-xs font-bold text-white">
              {user ? getInitials(user.name) : "?"}
            </div>
            <div className="hidden text-left md:block">
              <p className="text-xs font-semibold text-zinc-900 dark:text-white">
                {user?.name || "Guest"}
              </p>
              <p className="text-[10px] text-zinc-500">
                {user?.role ? ROLE_LABELS[user.role] : ""}
              </p>
            </div>
          </button>

          {/* Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-800">
              <div className="border-b border-zinc-100 px-4 py-3 dark:border-zinc-700">
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                  {user?.name}
                </p>
                <p className="text-xs text-zinc-500">{user?.email}</p>
              </div>
              <div className="p-1.5">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    router.push("/profile");
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
                >
                  <User className="h-4 w-4" />
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
