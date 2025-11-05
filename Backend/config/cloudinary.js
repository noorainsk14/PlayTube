import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (fileBuffer) => {
  try {
    const response = await cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) throw error;
        return result;
      }
    ).end(fileBuffer);

    return response;
  } catch (err) {
    console.error("Cloudinary Upload Error:", err);
    return null;
  }
};
