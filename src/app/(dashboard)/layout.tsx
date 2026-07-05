"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { RouteGuard } from "@/components/shared/route-guard";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading, hydrate } = useAuthStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-600/20">
            <span className="text-lg font-bold text-white">SP</span>
          </div>
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          <p className="text-sm text-zinc-500">Memuat aplikasi...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <RouteGuard>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          mobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
        />
        <div
          className="transition-all duration-300 lg:ml-0"
          style={{ marginLeft: 0 }}
        >
          <div
            className="hidden lg:block"
            style={{ marginLeft: sidebarCollapsed ? 72 : 260 }}
          >
            <Navbar
              sidebarCollapsed={sidebarCollapsed}
              onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
            />
          </div>
          <div className="lg:hidden">
            <Navbar
              sidebarCollapsed={false}
              onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
            />
          </div>
          <main
            className="min-h-[calc(100vh-64px)] p-4 transition-all duration-300 sm:p-6"
            style={{ marginLeft: 0 }}
          >
            <div
              className="hidden lg:block"
              style={{ marginLeft: sidebarCollapsed ? 72 : 260 }}
            >
              <div className="animate-fade-in">{children}</div>
            </div>
            <div className="lg:hidden">
              <div className="animate-fade-in">{children}</div>
            </div>
          </main>
        </div>
      </div>
    </RouteGuard>
  );
}
