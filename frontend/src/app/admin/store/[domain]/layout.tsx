import { ReactNode } from "react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import "./page-styles.css";

export const metadata = {
  title: "Store Management",
  description: "Store Management",
};

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({
  children,
}: AdminLayoutProps): JSX.Element {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className="min-h-screen w-full bg-default-white dark:bg-coal-600">
        <AdminNavbar />
        {children}
      </main>
    </SidebarProvider>
  );
}
