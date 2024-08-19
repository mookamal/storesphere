import AdminNavbar from "../../../../components/admin/AdminNavbar";
import AdminSidebar from "../../../../components/admin/AdminSidebar";
export default function AdminLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
        <AdminNavbar />
        <div className="flex flex-1">
          <AdminSidebar />
          <main className="flex-1 p-4 sm:ml-64">{children}</main>
        </div>
    </div>
  )
}
