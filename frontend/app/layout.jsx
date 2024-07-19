import  "bootstrap/dist/css/bootstrap.min.css";
import MainLayout from "./layouts/MainLayout";
import '../styles/globals.css';

export default function RootLayout({ children }) {
    return <MainLayout children={children} />
  }