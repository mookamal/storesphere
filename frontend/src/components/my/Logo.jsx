import Link from "next/link";
import Image from "next/image";
function Logo() {
  return (
    <Link href="/">
      <Image
        src="/assets/site/logo.png"
        alt="Logo"
        className="w-8 h-8 mr-2"
        width={30}
        height={24}
      />
    </Link>
  );
}

export default Logo;
