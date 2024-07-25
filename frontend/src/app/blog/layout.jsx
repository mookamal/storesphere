import Navbar from "../../components/main/Nav";
import Footer from "../../components/main/Footer";

export default function BlogLayout({ children}) {
  return (
    <>
    <Navbar />
    {children}
    <Footer />
    </>
  )
}
