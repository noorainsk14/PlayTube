import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (filePathOrUrl) => {
  try {
    if (!filePathOrUrl) return null;

    const isRemoteUrl = filePathOrUrl.startsWith("http");

    const response = await cloudinary.uploader.upload(filePathOrUrl, {
      resource_type: "auto",
    });

    if (!isRemoteUrl && fs.existsSync(filePathOrUrl)) {
      fs.unlinkSync(filePathOrUrl);
    }

    return response;
  } catch (error) {
    console.error("❌ Cloudinary Upload Error:", error);

    const isRemoteUrl = filePathOrUrl.startsWith("http");

    if (!isRemoteUrl && fs.existsSync(filePathOrUrl)) {
      fs.unlinkSync(filePathOrUrl);
    }

    return null;
  }
};

export { uploadOnCloudinary };
