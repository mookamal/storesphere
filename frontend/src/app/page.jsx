import FeatureBanner from "../components/main/home/FeatureBanner";
import StructureMetadata from "../helper/structureMetadata";
import HomeSupport from "../components/main/home/HomeSupport";
import siteInfo from "../data/site.json";
import Hero from "../components/main/home/Hero";
import Footer from "../components/main/Footer";
import MainNavbar from "../components/main/Nav";
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
        
      {/* <Footer /> */}
    </>
  );
}
