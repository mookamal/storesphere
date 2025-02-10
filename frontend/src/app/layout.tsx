import "../styles/globals.css";
// Importing toast styles
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from "@/components/theme-provider";
import AuthNextProvider from "@/providers/AuthNextProvider";
import { ToastContainer } from "react-toastify";
import { ApolloWrapper } from "@/lib/ApolloWrapper";
import { ReactNode } from "react";

// Define the interface for the component's props
interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="dark:bg-coal-500">
        {/* Theme provider for light/dark mode */}
        <ThemeProvider attribute="class" defaultTheme="light">
          {/* Authentication context provider */}
          <AuthNextProvider>
            {/* Apollo GraphQL wrapper */}
            <ApolloWrapper>
              {children}
            </ApolloWrapper>
          </AuthNextProvider>
        </ThemeProvider>
        {/* Toast container for notifications */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
        />
      </body>
    </html>
  );
}
