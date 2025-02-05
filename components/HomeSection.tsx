"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

import {
  signInWithGoogle,
  signOutUser,
  onAuthStateChange,
  User,
} from "@/lib/configs/firebase";
import { LogOutIcon } from "lucide-react";

const HomeSection = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    localStorage.removeItem("uploadedFile");
    localStorage.removeItem("styleRefUrl");
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      if (user) {
        setUser(user);
        console.log("User is now: ", user);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    await signInWithGoogle();
  };

  const handleSignOut = async () => {
    await signOutUser();
  };

  const [getStartedClicked, setGetStartedClicked] = useState(false);

  const handleGetStartedClick = () => {
    // setGetStartedClicked(true);
    router.push("/studio");
  };

  const handleOutsideAreaClick = () => {
    // setGetStartedClicked(false);
    router.push("/Test");
  };

  const handleStartCollecting = () => {
    // Navigate or perform an action when the button is clicked
    router.push("/Test");
  };

  return (
    // Original draft (Grid)
    <div className="w-full">
      {/* Background Content */}
      <div
        className={`w-full flex flex-col items-center absolute top-0 left-0 ${
          getStartedClicked ? "opacity-15" : "opacity-100"
        }`}
      >
        <div className="flex w-screen items-center overflow-hidden md:overflow-visible justify-center opacity-25 h-[32.5dvh] space-x-4 md:animate-scroll-right">
          {Array.from({ length: 98 }).map((_, index) => (
            <img
              key={index}
              src="/example/1.jpg"
              className={`h-full aspect-square rounded-lg motion-preset-blur-right ${
                index % 2 === 0 ? "motion-duration-700" : "motion-duration-1000"
              }`}
            />
          ))}
        </div>
        <div className="flex items-center justify-center h-[35dvh] w-screen md:w-[90%] overflow-hidden">
          <div className="h-full items-center justify-center rounded-lg">
            <div className="flex md:animate-scroll-left space-x-4 py-4 items-center justify-center w-full h-full rounded-lg">
              {Array.from({ length: 99 }).map((_, index) => (
                <img
                  key={index}
                  src="/example/2.jpg"
                  className={`object-cover h-full aspect-square rounded-lg motion-preset-blur-right ${
                    index % 2 === 0
                      ? "motion-duration-700"
                      : "motion-duration-1000"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex w-screen items-center md:w-full overflow-hidden md:overflow-visible justify-center opacity-25 h-[32.5dvh] space-x-4 md:animate-scroll-right">
          {Array.from({ length: 98 }).map((_, index) => (
            <img
              key={index}
              src="/example/1.jpg"
              className={`h-full aspect-square rounded-lg motion-preset-blur-right ${
                index % 2 === 0 ? "motion-duration-700" : "motion-duration-1000"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Initial Get Started Section */}
      <div
        className={`absolute w-full flex flex-col items-center justify-center h-[32.5dvh] motion-preset-slide-right motion-duration-1000 ${
          getStartedClicked ? "invisible" : "visible"
        }`}
      >
        <h1 className="py-2 font-sans font-extralight text-white text-center uppercase bg-black px-4 mb-6 opacity-60">
          Unleash your creativity
        </h1>
        <h1 className="font-sans font-bold text-white text-3xl text-center ">
          StyleForge
          <br /> Define yourself.
        </h1>
      </div>

      {/* Step 2: Wait for the magic */}
      <div className="w-full flex items-center justify-center mt-[67.5dvh] absolute">
        {" "}
        <div
          className={`w-[24rem] flex flex-col items-center justify-center h-[30dvh] px-16 motion-preset-slide-right motion-duration-1000 ${
            getStartedClicked ? "invisible" : "visible"
          }`}
        >
          <h1 className="font-sans font-semibold text-white text-xl text-center mb-6">
            Introducing new
            <br />
            versions of yourself !
          </h1>

          <Button
            className="w-full font-sans text-sm mb-3"
            onClick={handleGetStartedClick}
          >
            Get Started
          </Button>

          {!user && (
            <div
              className="w-full flex items-center justify-center py-1 space-x-2"
              style={{ backgroundColor: "rgba(30, 30, 30, 0.8)" }}
              onClick={handleSignIn}
            >
              <Image
                src="/brands/google.png"
                alt="Logo"
                width={40}
                height={40}
              />
              <h1 className="text-sm font-sans">Sign in With Google</h1>
            </div>
          )}
        </div>
      </div>

      {/* Tutorial Steps */}
      {/* <div
        className={`${
          getStartedClicked ? "block" : "hidden"
        } absolute flex items-center justify-center h-[100dvh]`}
        onClick={handleOutsideAreaClick}
      >
        <div className="flex flex-wrap items-center justify-center gap-[2.5vw] gap-y-8 z-99">
          <div className="w-[45vw] motion-preset-slide-right motion-duration-1500 motion-delay-0">
            <div className="w-[45vw] aspect-square relative">
              <Image
                alt="image"
                className="object-cover"
                layout="fill"
                src="/exampleChristmas/original.png"
              />
            </div>
            <h1 className="mt-2 text-center">
              Step 1: Take a photo or upload an image
            </h1>
          </div>
          <div className="w-[45vw] motion-preset-slide-right motion-duration-1500 motion-delay-[1000ms]">
            <div className="w-[45vw] aspect-square relative">
              <Image
                alt="image"
                className="object-cover"
                layout="fill"
                src="/exampleChristmas/loading.avif"
              />
            </div>
            <h1 className="mt-2 text-center">
              Step 2: Wait for the magic to happen
            </h1>
          </div>
          <div className="w-[45vw] motion-preset-slide-right motion-duration-1500 motion-delay-[2000ms]">
            <div className="w-[45vw] aspect-square relative">
              <Image
                alt="image"
                className="object-cover"
                layout="fill"
                src="/exampleChristmas/transformed.png"
              />
            </div>
            <h1 className="mt-2 text-center">
              Step 3: Collect & Save your new look
            </h1>
          </div>
          <div className="w-[45vw] motion-preset-slide-right motion-duration-1500 motion-delay-[3000ms]">
            <div className="w-[45vw] aspect-square relative">
              <Image
                alt="image"
                className="object-cover"
                layout="fill"
                src="/exampleChristmas/1.png"
              />
            </div>
            <h1 className="mt-2 text-center">
              Step 4: Keep collecting to win new variations
            </h1>
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <Button
              className="mt-4 p-[1.5rem] motion-preset-fade motion-duration-2000 motion-delay-[4500ms]"
              onClick={handleStartCollecting}
            >
              Start Collecting
            </Button>
          </div>
        </div>
      </div> */}
    </div>

    // // Updated draft (Idk)
    // <div className="w-full">
    //   {/* Background Content */}
    //   <div
    //     className={`w-full h-screen flex flex-col items-center justify-center absolute top-0 left-0 ${
    //       getStartedClicked ? "opacity-60" : "opacity-100"
    //     }`}
    //   >
    //     {/* <div className="opacity-100">
    //       <Image
    //         src="/bg/bg-red.png"
    //         alt="Logo"
    //         layout="fill"
    //         objectFit="cover"
    //       />
    //     </div> */}
    //     <img
    //       src="/bg/bg-red-updated.jpeg"
    //       className="absolute w-full h-full object-cover"
    //     />
    //     <div className="flex w-full items-center justify-center">
    //       <div className="mx-5 sm:mx-0 h-[32.5dvh] flex overflow-hidden items-center justify-center py-4">
    //         <img
    //           src="/home/homeHero.png"
    //           className="sm:h-full object-cover rounded-lg motion-preset-blur-right motion-duration-700"
    //         />
    //       </div>
    //     </div>
    //   </div>

    //   {/* Initial Get Started Section */}
    //   <div
    //     className={`absolute w-full flex flex-col items-center justify-center h-[32.5dvh] motion-preset-slide-right motion-duration-1000 ${
    //       getStartedClicked ? "invisible" : "visible"
    //     }`}
    //   >
    //     <h1 className="py-2 text-[1.5vh] sm:text-[2vh] font-sans font-extralight text-white text-center uppercase bg-black px-6 mb-6 opacity-60">
    //       Unleash your creativity
    //     </h1>
    //     <h1 className=" font-sans font-bold text-white text-[2.5vh] sm:text-[4vh] text-center">
    //       Redefine yourself with
    //       <br />
    //       Baksters Christmas
    //     </h1>
    //   </div>

    //   {/* Step 2: Wait for the magic */}
    //   <div className="w-full flex items-center justify-center mt-[67.5dvh] absolute">
    //     {" "}
    //     <div
    //       className={`flex flex-col items-center justify-center h-[30dvh] px-16 motion-preset-slide-right motion-duration-1000 ${
    //         getStartedClicked ? "invisible" : "visible"
    //       }`}
    //     >
    //       <h1 className="font-sans font-semibold text-white text-[2.5vh] text-center mb-6">
    //         Introducing new
    //         <br />
    //         versions of yourself !
    //       </h1>

    //       <Button
    //         className="w-full font-sans h-[4vh] text-[1.5vh] mb-4"
    //         onClick={handleGetStartedClick}
    //       >
    //         Get Started
    //       </Button>
    //       {user ? (
    //         <div className="">
    //           <h1 className="text-white text-sm opacity-70">Sign Out</h1>
    //         </div>
    //       ) : (
    //         <div
    //           className={`h-[5vh] w-full flex items-center justify-center space-x-2 `}
    //           style={{ backgroundColor: "rgba(30, 30, 30, 0.8)" }}
    //           onClick={handleSignIn}
    //         >
    //           <Image
    //             src="/brands/google.png"
    //             alt="Logo"
    //             width={35}
    //             height={35}
    //             className="py-[1vh]"
    //           />
    //           <h1 className="text-[1.5vh] font-sans flex items-center justify-center">
    //             Sign in With Google
    //           </h1>
    //         </div>
    //       )}
    //     </div>
    //   </div>

    //   {/* Tutorial Steps */}
    //   <div
    //     className={`${
    //       getStartedClicked ? "block" : "hidden"
    //     } w-full absolute flex items-center h-[100dvh] sm:items-start sm:h-auto justify-center`}
    //     onClick={handleOutsideAreaClick}
    //   >
    //     <div className="w-full sm:w-[50%] mt-0 sm:mt-12 flex flex-col items-center\ justify-center gap-[2.5vw] gap-y-8 z-99">
    //       <div className="flex items-center justify-center space-x-4">
    //         <div className="w-[40%] sm:w-[15rem] flex flex-col items-center motion-preset-slide-right motion-duration-1500 motion-delay-0">
    //           <div className="w-full aspect-square relative bg-red-700 rounded-t-lg">
    //             <Image
    //               alt="image"
    //               className="object-cover p-8"
    //               layout="fill"
    //               src="/steps/1.png"
    //             />
    //           </div>
    //           <h1 className="w-full p-2 text-center text-white bg-emerald-700 rounded-b-lg">
    //             Step 1: Capture or <br />
    //             or upload an image
    //           </h1>
    //         </div>
    //         <div className="w-[40%] sm:w-[15rem] flex flex-col items-center motion-preset-slide-right motion-duration-1500 motion-delay-[1000ms]">
    //           <div className="w-full aspect-square relative bg-red-700 rounded-t-lg">
    //             <Image
    //               alt="image"
    //               className="object-cover p-10"
    //               layout="fill"
    //               src="/steps/2.png"
    //             />
    //           </div>
    //           <h1 className="w-full p-2 text-center text-white bg-emerald-700 rounded-b-lg">
    //             Step 2: Wait for the <br />
    //             magic to happen
    //           </h1>
    //         </div>
    //       </div>

    //       <div className="flex items-center justify-center space-x-4">
    //         <div className="w-[40%] sm:w-[15rem] flex flex-col items-center motion-preset-slide-right motion-duration-1500 motion-delay-[2000ms]">
    //           <div className="w-full aspect-square relative bg-red-700 rounded-t-lg">
    //             <Image
    //               alt="image"
    //               className="object-cover p-5"
    //               layout="fill"
    //               src="/steps/3.png"
    //             />
    //           </div>
    //           <h1 className="w-full p-2 text-center text-white bg-emerald-700 rounded-b-lg">
    //             Step 3: Collect & Save your new look
    //           </h1>
    //         </div>
    //         <div className="w-[40%] sm:w-[15rem] flex flex-col items-center motion-preset-slide-right motion-duration-1500 motion-delay-[3000ms]">
    //           <div className="w-full aspect-square relative bg-red-700 rounded-t-lg">
    //             <Image
    //               alt="image"
    //               className="object-cover p-5"
    //               layout="fill"
    //               src="/steps/4.png"
    //             />
    //           </div>
    //           <h1 className="w-full p-2 text-center text-red-300 bg-emerald-700 rounded-b-lg">
    //             Keep collecting & <br />
    //             win new variations
    //           </h1>
    //         </div>
    //       </div>

    //       <div
    //         onClick={(e) => e.stopPropagation()}
    //         className="flex w-full justify-center"
    //       >
    //         <Button
    //           className="mt-4 p-[1.5rem] motion-preset-fade motion-duration-2000 motion-delay-[4500ms]"
    //           onClick={handleStartCollecting}
    //         >
    //           Start Collecting 🎅🏻
    //         </Button>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default HomeSection;
