"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, CheckCircle2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { User } from "firebase/auth";
import { onAuthStateChange } from "@/lib/configs/firebase";
import { buildHairTransformRequestBody } from "@/lib/services/hairstyleGeneration";
import imageCompression from "browser-image-compression";

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
  const [user, setUser] = useState<User | null>(null);

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
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [base64String, setBase64String] = useState<string>("");
  const [imageRef, setImageRef] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedFile = localStorage.getItem("uploadedFile") || "";
      const styleRef = localStorage.getItem("styleRefUrl");
      setBase64String(storedFile);
      setImageRef(styleRef);
    }
  }, []);

  if (!base64String) {
    return <div>No file found.</div>;
  }

  const defaultOptions = {
    maxSizeMB: 2.9,
  };

  const base64ToFile = (
    base64: string,
    fileName = "image.png",
    mimeType = "image/png"
  ) => {
    try {
      const byteString = atob(base64); // Directly decode Base64 string
      const ab = new ArrayBuffer(byteString.length);
      const ua = new Uint8Array(ab);

      for (let i = 0; i < byteString.length; i++) {
        ua[i] = byteString.charCodeAt(i);
      }

      return new File([ab], fileName, { type: mimeType });
    } catch (error) {
      throw new Error("Invalid Base64 string - Decoding failed.");
    }
  };

  // Convert File back to Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  async function compressFile(base64String: string, options = defaultOptions) {
    console.log("Converting base64 to file...");
    const file = base64ToFile(base64String);
    console.log("Converted file:", file);
    console.log("Compressing file...");
    const compressedFile = await imageCompression(file, options);
    console.log("Compressed file:", compressedFile);
    console.log("Converting compressed file back to base64...");
    return fileToBase64(compressedFile); // Convert back to base64 if needed
  }

  const handleOnClickGoBack = () => {
    window.history.back();
    localStorage.removeItem("uploadedFile");
    localStorage.removeItem("template");
  };

  const handleOnClickRetakePhoto = () => {
    localStorage.removeItem("uploadedFile");
    router.push("/image-upload");
  };

  const handleOnClickReselectStyle = () => {
    localStorage.removeItem("styleRefUrl");
    router.push("/studio");
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

      if (data === null) {
        setGenerationError(true);
        return;
      }

      const compressedData = await compressFile(data.output.message);
      console.log("Data Image Compression completed!");
      setGeneratedImage(data.output.message);

      if (!user) {
        console.log(
          "User is not logged in. Skipping image save to both Cloudinary and MongoDB..."
        );
      }

      if (compressedData) {
        const base64Image = compressedData;
        console.log("User is logged in. Saving...");
        const cloudinaryResponse = await fetch("/api/upload-to-cloudinary", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ base64Image: base64Image }),
        });
        const cloudinaryData = await cloudinaryResponse.json();
        console.log("Image saved! Cloudinary URL:", cloudinaryData.url);

        if (cloudinaryData.url) {
          // Save the response to MongoDB
          const mongoBody = {
            delayTime: data.delayTime,
            executionTime: data.executionTime,
            image: cloudinaryData.url,
            prompt: "Styleforge Special - Hairstyle Transformation.",
            userId: user?.uid,
            username: user?.displayName,
          };

          // // console.log("Lets post to MongoDB later:", data);
          console.log("Posting", mongoBody);
          try {
            const mongoResponse = await fetch("/api/savedImages", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(mongoBody),
            });
            console.log("MongoDB response status:", mongoResponse.status);
            const mongoResponseBody = await mongoResponse.json();
            console.log("MongoDB response body:", mongoResponseBody);
          } catch (error) {
            console.error("Error saving to MongoDB:", error);
          }
        }
      }
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
        <div className="px-0 md:px-36 items-center justify-center flex flex-col h-[90dvh]">
          <div className="my-6">
            <h1 className="text-center font-sans font-semibold text-2xl">
              {generationError === false
                ? "Image Generation Failed"
                : "Image Uploaded Successfully"}
            </h1>
            {generationError === false && (
              <h1 className="text-center text-red-400 px-12 mt-4">
                Please try again by uploading a clear, front-facing selfie with
                good lighting and minimal background distractions. Ensure your
                face is fully visible and not covered by any objects.
              </h1>
            )}
          </div>

          <div className="flex flex-col items-center justify-center px-12 md:px-0 w-full">
            <div className="flex gap-[5%]">
              <img
                src={base64String}
                alt="Uploaded Image"
                className="w-[47.5%] aspect-square object-cover"
              />
              <img
                src={imageRef || ""}
                alt="Reference Image"
                className="w-[47.5%] aspect-square object-cover"
              />
            </div>

            <div className="py-6 md:py-6 flex md:flex-row flex-col space-y-4 md:space-y-0 space-x-0 md:space-x-4 items-center justify-between w-full">
              <button
                onClick={handleOnClickRetakePhoto}
                className="w-full text-xs md:text-lg border-[0.25px] border-white text-white rounded-sm py-2 md:py-3 px-4 font-sans hover:bg-white hover:text-black transition-all duration-300 ease-in-out"
              >
                Retake Photo
              </button>
              <button
                onClick={handleOnClickReselectStyle}
                className="w-full text-xs md:text-lg border-[0.25px] border-white text-white rounded-sm py-2 md:py-3 px-4 font-sans hover:bg-white hover:text-black transition-all duration-300 ease-in-out"
              >
                Reselect Style
              </button>
              <button
                onClick={handleOnClickContinue}
                className="bg-white text-black w-full text-xs md:text-lg border-[0.25px] border-white rounded-sm py-2 md:py-3 px-4 font-sans hover:bg-emerald-800 hover:border-emerald-800 hover:text-white transition-all duration-200 ease-in-out"
              >
                Continue
              </button>
            </div>
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
