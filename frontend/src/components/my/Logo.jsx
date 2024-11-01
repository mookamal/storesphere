import Link from "next/link";
import Image from "next/image";
function Logo() {
  return (
    <Link href="/">
      <Image
        src="/assets/site/logo.png"
        alt="Logo"
        width={200}
        height={100}
        className="w-full h-12"
      />
    </Link>
  );
}

export default Logo;
