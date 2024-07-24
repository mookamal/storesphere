import Footer from "../../components/main/Footer";
import Navbar from "../../components/main/Nav";
import BootstrapJS from "../../helper/BootstrapJS";

export default function MainLayout ({ children }) {

    return (
      <html lang="en">
        <body>
            <BootstrapJS />
            <Navbar />
            {children}
            <Footer />
        </body>
      </html>
    )
  }