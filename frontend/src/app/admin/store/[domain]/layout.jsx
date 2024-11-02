import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import "./globals.css";

export const metadata = {
  title: "Store Management",
  description: "Store Management",
};

export default function AdminLayout({ children }) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className="min-h-screen w-full">
        <AdminNavbar />
        {children}
      </main>
    </SidebarProvider>
  );
}
