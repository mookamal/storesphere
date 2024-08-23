import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { ApolloWrapper } from "@/lib/apollo-wrapper";
import "./globals.css";
export const metadata = {
  title: 'Store Management',
  description: 'Store Management',
}

export default function AdminLayout({ children }) {
  return (
    <ApolloWrapper>
      <AdminNavbar />
      <AdminSidebar />
      <main className="p-4 sm:ml-64 mt-16 h-screen bg-screen-primary dark:bg-black">{children}</main>
    </ApolloWrapper>
  )
}