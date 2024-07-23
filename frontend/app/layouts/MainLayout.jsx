import Footer from "../../components/main/Footer";
import Navbar from "../../components/main/Nav";
import BootstrapJS from "../../helper/BootstrapJS";
import SiteInfo from "../../helper/core";



export default async function MainLayout ({ children }) {
  const info = await SiteInfo()

    return (
      <html lang="en">
        <body>
            <BootstrapJS />
            <Navbar info={info} />
            {children}
            <Footer info={info} />
        </body>
      </html>
    )
  }