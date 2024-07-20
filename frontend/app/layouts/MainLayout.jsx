import Footer from "../../components/main/Footer";
import Navbar from "../../components/main/Nav";
import BootstrapJS from "../../helper/BootstrapJS";
import SiteInfo from "../../helper/core";



export default async function MainLayout ({ children }) {
  const info = await SiteInfo()

    return (
      <html lang="en">
        <head>
          <title>{info.name}</title>
          <meta name="description" content={info.desc} />
        </head>
        <body>
            <BootstrapJS />
            <Navbar info={info} />
            {children}
            <Footer info={info} />
        </body>
      </html>
    )
  }