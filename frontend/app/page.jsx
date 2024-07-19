import SiteInfo from "../helper/core"
import Hero from "../components/main/home/hero"
import FeatureBanner from "../components/main/home/FeatureBanner"
export default async function  Home() {
    const siteInfo = await SiteInfo()
    return (
        <>
            <Hero info={siteInfo} />
            <FeatureBanner />
        </>
    )
}