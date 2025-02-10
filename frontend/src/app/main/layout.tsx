import MainNavbar from "@/components/main/Nav";
import MainFooter from "@/components/main/Footer";
import { ReactNode, FC } from "react";


interface HomeLayoutProps {
  children: ReactNode;
}

const HomeLayout: FC<HomeLayoutProps> = ({ children }) => {
  return (
    <>
      {/* Header */}
      <MainNavbar />
      {/* Main content */}
      <main className="min-h-screen">
        {children}
      </main>
      {/* Footer */}
      <MainFooter />
    </>
  );
};

export default HomeLayout;
