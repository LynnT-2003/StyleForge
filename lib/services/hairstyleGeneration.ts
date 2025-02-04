export const buildHairTransformRequestBody = (
  base64Image: string | null,
  referenceImageUrl: string | null
) => {
  return {
    input: {
      workflow: {
        "1": {
          inputs: {
            seed: 102709385725920,
            steps: 20,
            cfg: 1.5,
            control_strength: 1,
            adapter_strength: 1,
            model: ["3", 0],
            images: ["4", 0],
            bald_image: ["7", 0],
          },
          class_type: "ApplyHairTransfer",
          _meta: {
            title: "ApplyHairTransfer",
          },
        },
        "3": {
          inputs: {
            ckpt_name: "juggernaut_reborn.safetensors",
            encoder_model: "hair_encoder_model.bin",
            adapter_model: "hair_adapter_model.bin",
            control_model: "hair_controlnet_model.bin",
            device: "AUTO",
          },
          class_type: "LoadStableHairTransferModel",
          _meta: {
            title: "LoadStableHairTransferModel",
          },
        },
        "4": {
          inputs: {
            width: 512,
            height: 512,
            interpolation: "nearest",
            method: "stretch",
            condition: "always",
            multiple_of: 0,
            image: ["5", 0],
          },
          class_type: "ImageResize+",
          _meta: {
            title: "\ud83d\udd27 Image Resize",
          },
        },
        "5": {
          inputs: {
            facedetection: "retinaface_resnet50",
            image: ["15", 0],
          },
          class_type: "CropFace",
          _meta: {
            title: "CropFace",
          },
        },
        "6": {
          inputs: {
            image: "current.jpg",
            upload: "image",
          },
          class_type: "LoadImage",
          _meta: {
            title: "Load Image",
          },
        },
        "7": {
          inputs: {
            seed: Math.floor(10000 + Math.random() * 90000),
            steps: 20,
            strength: 1,
            cfg: 1.5,
            bald_model: ["10", 0],
            images: ["11", 0],
          },
          class_type: "ApplyHairRemover",
          _meta: {
            title: "ApplyHairRemover",
          },
        },
        "10": {
          inputs: {
            ckpt_name: "juggernaut_reborn.safetensors",
            bald_model: "hair_bald_model.bin",
            device: "AUTO",
          },
          class_type: "LoadStableHairRemoverModel",
          _meta: {
            title: "LoadStableHairRemoverModel",
          },
        },
        "11": {
          inputs: {
            width: 512,
            height: 512,
            interpolation: "nearest",
            method: "stretch",
            condition: "always",
            multiple_of: 0,
            image: ["12", 0],
          },
          class_type: "ImageResize+",
          _meta: {
            title: "\ud83d\udd27 Image Resize",
          },
        },
        "12": {
          inputs: {
            facedetection: "retinaface_resnet50",
            image: ["6", 0],
          },
          class_type: "CropFace",
          _meta: {
            title: "CropFace",
          },
        },
        "15": {
          inputs: {
            url: referenceImageUrl,
            cache: false,
          },
          class_type: "LoadImageByUrl //Browser",
          _meta: {
            title: "Load Image By URL",
          },
        },
        "77": {
          inputs: {
            upscale_model: ["79", 0],
            image: ["1", 0],
          },
          class_type: "ImageUpscaleWithModel",
          _meta: {
            title: "Upscale Image (using Model)",
          },
        },
        "79": {
          inputs: {
            model_name: "4x-UltraSharp.pth",
          },
          class_type: "UpscaleModelLoader",
          _meta: {
            title: "Load Upscale Model",
          },
        },
        "81": {
          inputs: {
            filename_prefix: "ComfyUI",
            images: ["77", 0],
          },
          class_type: "SaveImage",
          _meta: {
            title: "Save Image",
          },
        },
      },
      images: [
        {
          name: "current.jpg",
          image: base64Image,
        },
      ],
    },
  };
};
