import Footer from "../../components/main/Footer";
import Navbar from "../../components/main/Nav";
import BootstrapJS from "../../helper/BootstrapJS";
import siteInfo from "../../data/site.json";



export default function MainLayout ({ children }) {

    return (
      <html lang="en">
        <body>
            <BootstrapJS />
            <Navbar info={siteInfo} />
            {children}
            <Footer info={siteInfo} />
        </body>
      </html>
    )
  }