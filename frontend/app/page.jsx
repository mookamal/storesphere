import SiteInfo from "../helper/core"
import Hero from "../components/main/home/hero"
import FeatureBanner from "../components/main/home/FeatureBanner"
import StructureMetadata from '../helper/structureMetadata';
export async function generateMetadata({ params }) {
    const siteInfo = await SiteInfo()
  
    return StructureMetadata({
      title: siteInfo.name,
      description: siteInfo.description,
      image: siteInfo.logo,
    });
  }

export default async function  Home() {
    const siteInfo = await SiteInfo()
    return (
        <>
            <Hero info={siteInfo} />
            <FeatureBanner />
        </>
    )
}