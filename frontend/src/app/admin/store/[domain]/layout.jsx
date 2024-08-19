import AdminNavbar from "../../../../components/admin/AdminNavbar";
import AdminSidebar from "../../../../components/admin/AdminSidebar";
export default function AdminLayout({ children }) {
  return (
    <>
    <AdminNavbar />
    <AdminSidebar />
    <main className="p-4 sm:ml-64 mt-14">{children}</main>
    </>
  )
}