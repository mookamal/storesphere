import "../styles/globals.css";
import "react-toastify/ReactToastify.min.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastContainer } from "react-toastify";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="dark:bg-coal-500">
        <ThemeProvider attribute="class" defaultTheme="light">
          {children}
        </ThemeProvider>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
        />
      </body>
    </html>
  );
}
