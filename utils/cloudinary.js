import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🖼️ Upload image
const uploadImageToCloudinary = async (localFilePath) => {
  return await uploadFile(localFilePath, "image");
};

// 📄 Upload PDF
// const uploadPDFToCloudinary = async (localFilePath) => {
//   return await uploadFile(localFilePath, "auto");
// };

// 🔁 Common logic
const uploadFile = async (localFilePath, resourceType) => {
  try {
    if (!localFilePath) {
      throw new Error("File path is missing.");
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: resourceType,
    });

    // Delete file after successful upload
    try {
      await fs.promises.access(localFilePath);
      await fs.promises.unlink(localFilePath);
    } catch (unlinkError) {
      if (unlinkError.code !== "ENOENT") {
        console.error("Error deleting file:", unlinkError.message);
        throw unlinkError;
      }
    }

    return response;
  } catch (error) {
    console.error(`Cloudinary ${resourceType} upload failed:`, error.message);

    // Try cleanup even on failure
    try {
      await fs.promises.access(localFilePath);
      await fs.promises.unlink(localFilePath);
    } catch (unlinkError) {
      if (unlinkError.code !== "ENOENT") {
        console.error("Cleanup failed:", unlinkError.message);
      }
    }

    throw error;
  }
};

export { uploadImageToCloudinary };
