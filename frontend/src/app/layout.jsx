import  "bootstrap/dist/css/bootstrap.min.css";;
import '../styles/globals.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import BootstrapJS from "../helper/BootstrapJS";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head><BootstrapJS /></head>
      <body>{children}</body>
    </html>
  )
}