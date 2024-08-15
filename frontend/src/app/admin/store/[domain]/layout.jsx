import Navbar from "../../../../components/admin/navbar";
export default function AdminLayout({ children }) {
  return (
    <>
        <Navbar />
        <main>{children}</main>
    </>
  )
}
