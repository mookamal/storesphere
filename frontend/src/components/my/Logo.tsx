import Link from "next/link";
import Image from "next/image";
import type { FC } from "react";
import React, { memo } from "react";

const Logo: FC = () => {
  return (
    <Link href="/">
      <Image
        src="/assets/site/logo.png"
        alt="Logo"
        className="w-8 h-8 mr-2"
        width={30}
        height={24}
        priority
      />
    </Link>
  );
};

export default memo(Logo);