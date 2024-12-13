import React from "react";
import Link from "next/link";
import Image from "next/image";

const Logo = () => {
  return (
    <div className="bg-transparent pl-[50px]">
      <Link href="/" className="flex gap-[10px]">
        <Image src={"/images/logo.png"} alt="logo" height={30} width={35} />
        <h2 className="text-center">
          <span className="font-extrabold text-[25px] uppercase text-black tracking-[1px] ">
            VIBECART
          </span>
        </h2>
      </Link>
    </div>
  );
};

export default Logo;
