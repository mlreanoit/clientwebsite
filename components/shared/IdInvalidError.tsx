import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";

const IdInvalidError = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-100">
      <Image
        src={"/images/broken-link.jpg"}
        alt="Some thing went wrong image"
        width={350}
        height={350}
      />
      <h2 className="heading mb-[10px] my-[20px]">
        This page isn't available!
      </h2>
      <p className="text-sm text-gray-500 my-[20px]">
        The link may be broken, or the page may have been removed.
      </p>
      <Link href={"/shop"} className="my-[20px]">
        <Button>Go to Shop Page</Button>
      </Link>
    </div>
  );
};

export default IdInvalidError;
