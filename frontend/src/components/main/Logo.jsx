import Link from "next/link";
import Image from "next/image";
import siteInfo from "../../data/site.json";
export default function Logo() {
  return (
    <Link href="/" className="navbar-brand">
      <Image
        src={siteInfo.logo}
        className="d-inline-block align-text-top"
        width={30}
        height={24}
        alt={siteInfo.name}
      />
    </Link>
  );
}
