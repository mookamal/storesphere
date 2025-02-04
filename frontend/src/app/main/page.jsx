import StructureMetadata from "../../helper/structureMetadata";
import siteInfo from "../../data/site.json";
import Hero from "@/components/main/home/Hero";
import FeaturesSection from "@/components/main/home/Features";
import TestimonialsSection from "@/components/main/home/Testimonials";
import MainFooter from "@/components/main/Footer";
import MainNavbar from "@/components/main/Nav";

export function generateMetadata() {
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
      <main className="min-h-screen">
        <Hero />
        <FeaturesSection />
        <TestimonialsSection />
      </main>
      <MainFooter />
    </>
  );
}
