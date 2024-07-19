import SiteInfo from "../helper/core"
import Hero from "../components/main/home/hero"
export default async function  Home() {
    const siteInfo = await SiteInfo()
    return (
        <>
            <Hero info={siteInfo} />
        </>
    )
}