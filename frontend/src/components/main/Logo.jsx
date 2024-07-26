import Image from "next/image";
import siteInfo from "../../data/site.json";
export default function Logo() {
  return (
      <Image
        src={siteInfo.logo}
        className="w-8 h-8 mr-2"
        width={30}
        height={24}
        alt={siteInfo.name}
      />
  );
}
