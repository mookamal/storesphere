import StructureMetadata from "../helper/structureMetadata";
import siteInfo from "../data/site.json";
import Hero from "@/components/main/home/Hero";
import MainFooter from "@/components/main/Footer";
import MainNavbar from "@/components/main/Nav";
export function generateMetadata({ params }) {
  return StructureMetadata({
    title: siteInfo.name,
    description: siteInfo.description,
    image: siteInfo.logo,
  });
}

export default function Home() {
  return (
    <>
      <MainNavbar />
      <main className="min-h-screen mt-20">
        <Hero />
      </main>
      <MainFooter />
    </>
  );
}
