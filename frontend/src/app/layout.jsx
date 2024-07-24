import  "bootstrap/dist/css/bootstrap.min.css";
import MainLayout from "./layouts/MainLayout";
import '../styles/globals.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
export default function RootLayout({ children }) {
    return <MainLayout children={children} />
  }