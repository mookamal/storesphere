import AdminNavbar from "../../../../components/admin/AdminNavbar";
import AdminSidebar from "../../../../components/admin/AdminSidebar";

export const metadata = {
  title: 'Store Management',
  description: 'Store Management',
}

export default function AdminLayout({ children }) {
  return (
    <>
    <AdminNavbar />
    <AdminSidebar />
    <main className="p-4 sm:ml-64 mt-16 bg-slate-100 dark:bg-black">{children}</main>
    </>
  )
}