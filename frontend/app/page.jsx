import SiteInfo from "../helper/core"
export default async function  Home() {
    const siteInfo = await SiteInfo()
    return (
        <>
        <p>
            {siteInfo.name}
        </p>
        </>
    )
}