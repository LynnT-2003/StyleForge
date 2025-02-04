"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ImagePlus, ImagePlusIcon } from "lucide-react";
import { Alert, Snackbar } from "@mui/material";

interface ModelDetailPageProps {
  model: string;
}

const ModelDetailPage: React.FC = () => {
  const { model } = useParams<{ model: string }>();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const cameraModalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        cameraModalRef.current &&
        !cameraModalRef.current.contains(event.target as Node)
      ) {
        setIsCameraOpen(false);
      }
    };

    if (isCameraOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCameraOpen]);

  const handleCapture = (model: string) => {
    console.log("Camera clicked");
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        // setFile(imageSrc); // Set the captured image as the file
        localStorage.setItem("uploadedFile", imageSrc);
        if (model) {
          localStorage.setItem("model", model);
        }
        console.log("Captured Image: ", imageSrc);
        setIsCameraOpen(false);
        router.push("/image-upload/upload-success");
      }
    }
  };

  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [alertOpen, setAlertOpen] = useState<boolean>(false);

  const handleFileUpload = (file: File) => {
    try {
      console.log("File uploaded:", file);

      // Check if file size exceeds 5MB
      if (file.size > 5 * 1024 * 1024) {
        // Trigger the alert for files over 5MB
        console.log("File size exceeds 5MB. Please upload a smaller file.");
        setAlertOpen(true);
        return;
      }

      const reader = new FileReader();
      // const chosenTemplate = template;

      reader.onload = () => {
        const base64String = reader.result as string;
        localStorage.setItem("uploadedFile", base64String);
        router.push("/image-upload/upload-success");
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error during file upload:", error);
      alert("An error occurred during the file upload. Please try again.");
    }
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleReset = () => {
    setFile(null); // Clear the file state
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input value
    }
  };

  const router = useRouter();

  return (
    <div className={`min-h-screen ${model}`}>
      <div
        className="h-[100dvh] sm:h-[100vh] w-full overflow-y-hidden sm:py-12"
        style={{
          backgroundColor: "var(--background-primary)",
          color: "var(--text-primary)",
        }}
      >
        <div className="w-full relative h-[90%] flex items-center justify-center">
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            className="h-full w-full sm:w-[70%] object-cover rounded-t-xl transform scale-x-[-1]"
          />

          <div className="w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full flex items-center justify-center">
            <div className="absolute flex flex-wrap w-full aspect-square p-16 items-center justify-center gap-24">
              <div className="sm:hidden w-[20%] h-[20%] border-t-2 border-l-2 border-blue-400" />
              <div className="sm:hidden w-[20%] h-[20%] border-t-2 border-r-2 border-blue-400" />
              <div className="sm:hidden w-[20%] h-[20%] border-b-2 border-l-2 border-blue-400" />
              <div className="sm:hidden w-[20%] h-[20%] border-b-2 border-r-2 border-blue-400" />
              <h1 className="sm:hidden absolute bottom-[0.5rem] text-white text-center bg-[#294c29] py-2 px-4 rounded-full opacity-60">
                Take a clear picture
              </h1>
              {alertOpen && (
                <Snackbar
                  open={alertOpen}
                  autoHideDuration={5000}
                  onClose={handleAlertClose}
                  className="mx-auto w-[75vw] absolute bottom-0 z-50"
                >
                  <Alert
                    onClose={handleAlertClose}
                    severity="error"
                    sx={{ width: "100%" }}
                  >
                    File size exceeds 5MB. Please upload a smaller file.
                  </Alert>
                </Snackbar>
              )}
            </div>
          </div>
        </div>

        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => {
            const selectedFile = e.target.files?.[0];
            if (selectedFile) {
              // Validate file size
              if (selectedFile.size > 5 * 1024 * 1024) {
                setAlertOpen(true);
              } else {
                handleFileUpload(selectedFile); // Proceed with file processing
              }

              // Reset the file input so the same file can be selected again
              if (fileInputRef.current) {
                fileInputRef.current.value = ""; // Clear the value programmatically
              }
            }
          }}
          className="hidden"
        />

        <div className="w-full relative flex items-center justify-center">
          <div
            className="flex w-full sm:w-[70%] h-[10dvh] md:h-auto bg-opacity-0 md:bg-opacity-100 items-center justify-between sm:rounded-none md:rounded-b-xl"
            style={{
              backgroundColor: "var(--background-secondary)",
              color: "var(--text-primary)",
            }}
          >
            <Button
              onClick={() => {
                router.push("/studio");
              }}
              variant={"ghost"}
              className="w-1/3 flex items-center justify-center bg-none h-full hover:text-opacity-50"
              style={{
                color: "var(--text-primary)",
              }}
            >
              <div className="flex flex-col w-[3.5rem] items-center justify-center">
                <ArrowLeft />
                <h1 className="font-semibold mt-0 text-[0.75rem]">Back</h1>
              </div>
            </Button>
            <div className="w-1/3 h-full pt-2 flex items-center justify-center z-99">
              <Button
                onClick={() => handleCapture(model)}
                className="p-[1.5rem] rounded-full aspect-square bg-gray-100 border-gray-300 border-[0.2rem] sm:border-[0.3rem] hover:bg-white"
                variant={"ghost"}
              ></Button>
            </div>
            <Button
              onClick={handleClick}
              variant={"ghost"}
              className="w-1/3 flex items-center justify-center bg-none h-full hover:text-opacity-50"
              style={{
                color: "var(--text-primary)",
              }}
            >
              <div className="flex flex-col h-9 items-center justify-center">
                <img
                  src="/brands/upload.png"
                  alt="Upload"
                  className="h-full py-1"
                />
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelDetailPage;
