import StructureMetadata from "../../helper/structureMetadata";
import siteInfo from "../../data/site.json";
import Hero from "@/components/main/home/Hero";
import FeaturesSection from "@/components/main/home/Features";
import TestimonialsSection from "@/components/main/home/Testimonials";
import { JSX } from "react";

// Define an interface for the site info (optional but helps with type checking)
interface SiteInfo {
  name: string;
  description: string;
  logo: string;
}

// Cast the imported JSON data to the SiteInfo type
const site: SiteInfo = siteInfo;

// Generate metadata using a helper function
export function generateMetadata() {
  return StructureMetadata({
    title: site.name,
    description: site.description,
    image: site.logo,
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
