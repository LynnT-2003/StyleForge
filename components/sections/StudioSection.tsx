"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { hairstyles } from "@/constants/hairstyles";

const StudioSection = () => {
  const router = useRouter();

  const handleStyleClicked = (styleRefUrl: string) => {
    console.log(styleRefUrl);
    localStorage.setItem("styleRefUrl", styleRefUrl);
    router.push("/image-upload");
  };

  return (
    <div className="w-full">
      <h1 className="text-center text-lg md:text-xl font-semibold">
        Pick your Style
      </h1>
      <div className="w-full flex flex-wrap gap-6 md:gap-8 px-0 md:px-8 justify-center mt-4">
        {hairstyles.map((hairstyle) => (
          <div
            className="w-[45%] md:w-[240px] hover:cursor-pointer hover:opacity-70"
            key={hairstyle.name}
            onClick={() => handleStyleClicked(hairstyle.image)}
          >
            <img
              src={hairstyle.image}
              alt=""
              className="w-full h-[180px] md:h-[220px] object-cover object-top md:object-center rounded-lg"
            />
            <h1 className="mt-1 text-center">{hairstyle.name}</h1>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudioSection;
