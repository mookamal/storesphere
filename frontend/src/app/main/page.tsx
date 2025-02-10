import StructureMetadata from "@/lib/structureMetadata";
import siteInfo from "@/data/siteInfo";
import Hero from "@/components/main/home/Hero";
import FeaturesSection from "@/components/main/home/Features";
import TestimonialsSection from "@/components/main/home/Testimonials";
import { JSX } from "react";



// Generate metadata using a helper function
export function generateMetadata() {
  return StructureMetadata({
    title: siteInfo.name,
    description: siteInfo.description,
    image: siteInfo.logo,
  });
}

// Main home page component
export default function Home(): JSX.Element {
  return (
    <>
      <Hero />
      <FeaturesSection />
      <TestimonialsSection />
    </>
  );
}
