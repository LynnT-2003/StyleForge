"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, CheckCircle2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
// import { User } from "firebase/auth";
// import { onAuthStateChange } from "@/lib/firebase";
import { buildHairTransformRequestBody } from "@/lib/services/hairstyleGeneration";
// import {
//   FacebookShareButton,
//   FacebookIcon,
//   LineShareButton,
//   LineIcon,
//   TwitterShareButton,
//   TwitterIcon,
//   RedditShareButton,
//   RedditIcon,
// } from "react-share";

const UploadSuccessScreen = () => {
  //   const [user, setUser] = useState<User | null>(null);

  //   useEffect(() => {
  //     const unsubscribe = onAuthStateChange((user) => {
  //       if (user) {
  //         setUser(user);
  //         console.log("User is now: ", user);
  //       } else {
  //         setUser(null);
  //       }
  //     });
  //     return () => unsubscribe();
  //   }, []);
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [base64String, setBase64String] = useState<string | null>(null);
  const [imageRef, setImageRef] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedFile = localStorage.getItem("uploadedFile");
      const styleRef = localStorage.getItem("styleRefUrl");
      setBase64String(storedFile);
      setImageRef(styleRef);
    }
  }, []);

  if (!base64String) {
    return <div>No file found.</div>;
  }

  const handleOnClickGoBack = () => {
    window.history.back();
    localStorage.removeItem("uploadedFile");
    localStorage.removeItem("template");
  };

  const handleOnClickContinue = async () => {
    console.log("Clicked on continue.");
    console.log("Ref URL:", imageRef);
    setLoading(true);

    const trimmedBased64String = base64String.replace(
      /^data:image\/\w+;base64,/,
      ""
    );

    // console.log("Trimmed base64 string:", trimmedBased64String);

    const body = buildHairTransformRequestBody(trimmedBased64String, imageRef);
    console.log("Body:", body);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_RUNPOD_SERVERLESS_ENDPOINT_2}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_RUNPOD_API_KEY}`,
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Success!");
      console.log("API Response:", data);
      setGeneratedImage(data.output.message);

      //   if (!user) {
      //     console.log(
      //       "User is not logged in. Skipping image save to both Cloudinary and MongoDB..."
      //     );
      //   }

      //   if (data.output.message) {
      //     const base64Image = data.output.message;
      //     console.log("User is logged in. Saving...");
      //     const cloudinaryResponse = await fetch("/api/upload-to-cloudinary", {
      //       method: "POST",
      //       headers: {
      //         "Content-Type": "application/json",
      //       },
      //       body: JSON.stringify({ base64Image: base64Image }),
      //     });
      //     const cloudinaryData = await cloudinaryResponse.json();
      //     console.log("Image saved! Cloudinary URL:", cloudinaryData.url);

      //     if (cloudinaryData.url) {
      //       // Save the response to MongoDB
      //       const mongoBody = {
      //         delayTime: data.delayTime,
      //         executionTime: data.executionTime,
      //         image: cloudinaryData.url,
      //         prompt: "PrismaForge Special - Mystical Christmas Themed Portrait.",
      //         userId: user?.uid,
      //         username: user?.displayName,
      //       };

      //       // // console.log("Lets post to MongoDB later:", data);
      //       console.log("Posting", mongoBody);
      //       try {
      //         const mongoResponse = await fetch("/api/savedImages", {
      //           method: "POST",
      //           headers: {
      //             "Content-Type": "application/json",
      //           },
      //           body: JSON.stringify(mongoBody),
      //         });
      //         console.log("MongoDB response status:", mongoResponse.status);
      //         const mongoResponseBody = await mongoResponse.json();
      //         console.log("MongoDB response body:", mongoResponseBody);
      //       } catch (error) {
      //         console.error("Error saving to MongoDB:", error);
      //       }
      //     }
      //   }
    } catch (error) {
      console.error("Failed to generate image.", error);
    }
    setLoading(false);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${generatedImage}`;
    link.download = "Prismaforge_Christmas.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL);
    setIsCopied(true);
  };

  return (
    <div className="h-screen w-full flex flex-col items-center">
      {!generatedImage && !loading && (
        <div className="sm:w-[35%] h-[90%] flex flex-col items-center justify-center">
          <h1 className="mx-12 text-center text-white pt-[1.7rem] text-2xl font-semibold font-sans motion-preset-slide-right">
            Image Uploaded <br />
            Successfully!
          </h1>
          <div className="mx-12 relative aspect-square mt-7 rounded-lg ">
            <img
              src={base64String}
              className="w-full aspect-square rounded-lg opacity-25 border-[12px] border-green-700 object-cover motion-preset-expand motion-duration-300"
            />
            <div className="w-[80%] h-[80%] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center justify-center">
              <CheckCircle2Icon
                className="w-[40%] h-[40%] text-green-500 motion-preset-pop motion-duration-1000"
                style={{
                  transformOrigin: "center",
                }}
              />
              <h1 className="text-center text-white pt-4 text-md font-semibold font-sans opacity-100 motion-preset-expand motion-duration-300">
                Your new Image ready
              </h1>
              <h1 className="text-center text-white pt-0 text-md font-semibold font-sans opacity-100 motion-preset-expand motion-duration-300">
                to be generated.
              </h1>
            </div>
          </div>

          <div className="px-12 flex mt-7 items-center justify-between space-x-4 w-full">
            <Button
              className="w-full"
              variant="default"
              onClick={handleOnClickGoBack}
            >
              Go Back
            </Button>
            <Button className="w-full" onClick={handleOnClickContinue}>
              Continue <ArrowRightIcon className="w-4 h-5 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {loading && (
        <div className="w-full flex flex-col items-center justify-center h-full pt-[1.7rem] text-white">
          <div className="h-full rounded-xl p-[2vh] flex flex-col justify-center items-center">
            <div className="w-[210px] rounded-full flex flex-col justify-center items-center ">
              <h1 className="font-sans font-semibold text-lg text-white">
                Crafting your image...
              </h1>
              <div
                className="mt-6 mb-3 bg-gradient-to-r from-blue-300 via-blue-500 to-blue-300 h-2 rounded-full animate-pulse"
                style={{ width: "100%" }}
              />
            </div>
            <h1 className="text-sm animate-pulse text-white">
              This may take up to 30 seconds.
            </h1>
            <h1 className="text-sm animate-pulse text-white">
              Please do not quit or refresh the page.
            </h1>
          </div>
        </div>
      )}

      {generatedImage && !loading && (
        // <div className="">
        //   <h1 className="mx-12 pt-[1.7rem] text-center text-2xl font-semibold font-sans motion-preset-slide-right">
        //     Image Generated!
        //   </h1>
        //   <div className="relative mx-12 mt-7 rounded-lg flex items-center justify-center">
        //     <img
        //       src={`data:image/png;base64,${generatedImage}`} // Update the format if needed
        //       className="w-full sm:w-[40%] aspect-square rounded-lg object-cover motion-preset-expand motion-duration-500"
        //     />
        //   </div>
        // </div>
        <div className="w-[80%] sm:w-[35%] h-[90%] flex flex-col items-center justify-center">
          <h1 className="mx-12 text-center text-white pt-[1.7rem] text-2xl font-semibold font-sans motion-preset-slide-right">
            Generation Result
          </h1>
          <div className="relative aspect-square mt-7 rounded-lg ">
            <img
              src={`data:image/png;base64,${generatedImage}`}
              className="w-full aspect-square rounded-t-lg object-cover motion-preset-expand motion-duration-300"
            />
          </div>
          <div className="w-full flex flex-col">
            <div className="w-full space-x-[2%] mt-4">
              <Button className="w-[49%]" onClick={handleOnClickContinue}>
                Generate Again
              </Button>
              <Button className="w-[49%]" onClick={handleDownload}>
                Save to Device
              </Button>
            </div>
          </div>
          {/* <div className="w-full space-x-[5%] mt-8 flex items-center justify-center">
            <FacebookShareButton
              url="https://prismaforge.vercel.app/"
              hashtag="#prismaforge"
            >
              <FacebookIcon size={32} round={true} />
            </FacebookShareButton>
            <LineShareButton url="https://prismaforge.vercel.app/">
              <LineIcon size={32} round={true} />
            </LineShareButton>
            <TwitterShareButton
              url="https://prismaforge.vercel.app/"
              title="PrismaForge"
            >
              <TwitterIcon size={32} round={true} />
            </TwitterShareButton>
            <RedditShareButton
              url="https://prismaforge.vercel.app/"
              title="PrismaForge"
            >
              <RedditIcon size={32} round={true} />
            </RedditShareButton>
          </div> */}
          <div className="flex items-center mt-4">
            <h1 className="text-white font-sans text-[0.5rem] sm:text-xs font-extralight">
              Support us by sharing with family and friends
            </h1>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadSuccessScreen;
