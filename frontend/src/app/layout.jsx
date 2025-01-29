import "../styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import AuthNextProvider from "@/providers/AuthNextProvider";
import { ToastContainer } from "react-toastify";
import { ApolloWrapper } from "@/lib/ApolloWrapper";
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="dark:bg-coal-500">
        <ThemeProvider attribute="class" defaultTheme="light">
          <AuthNextProvider>
            <ApolloWrapper>
              {children}
            </ApolloWrapper>
          </AuthNextProvider>
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
