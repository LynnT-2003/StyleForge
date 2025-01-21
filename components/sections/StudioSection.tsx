import React from "react";

const StudioSection = () => {
  const hairstyles = [
    { name: "Luxe Waves", image: "/example/1.jpg" },
    { name: "Sleek & Chic Bob", image: "/example/1.jpg" },
    { name: "Textured Topknot", image: "/example/1.jpg" },
    { name: "Boho Braids", image: "/example/1.jpg" },
    { name: "Ponytail Style", image: "/example/1.jpg" },
    { name: "Classic Shag", image: "/example/1.jpg" },
    { name: "Messy Curls", image: "/example/1.jpg" },
    { name: "Retro Pompadour", image: "/example/1.jpg" },
    { name: "Modern Pixie", image: "/example/1.jpg" },
    { name: "Beachy Lob", image: "/example/1.jpg" },
  ];

  return (
    <div className="w-full">
      <h1 className="text-center text-lg md:text-xl font-semibold">
        Pick your Style
      </h1>
      <div className="w-full flex flex-wrap gap-6 md:gap-8 px-0 md:px-8 justify-center mt-4">
        {hairstyles.map((hairstyle) => (
          <div className="w-[45%] md:w-[240px] hover:cursor-pointer hover:opacity-70">
            <img src={hairstyle.image} alt="" className="w-full" />
            <h1 className="mt-1 text-center">{hairstyle.name}</h1>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudioSection;
