import { v2 as cloudinary } from "cloudinary"; // import cloudinary v2
import fs from "fs";
import { CLOUDINARY_API_KEY, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_SECRET } from "./serverConfig.js";

cloudinary.config({ 
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (LocalFilePath) =>{
    try {
        if(!LocalFilePath){
            throw new Error("LocalFilePath is required");
        }
        // upload the file om cloudinary
        const response = await cloudinary.uploader.upload(LocalFilePath, {
            resource_type: "auto" // this means that cloudinary will automatically detect the type of file
        });
        fs.unlinkSync(LocalFilePath);
        return response;
    } catch (error) {
        //fs.unlinkSync(LocalFilePath); // delete the file from local storage
        console.log(error);
        return null;
        
    }
}

// Function to extract the public ID from a Cloudinary URL
function getPublicIdFromUrl(url) {
    // This regex captures the public ID part from a typical Cloudinary URL
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(\.[a-zA-Z]+)?$/);
    return match ? match[1] : null;
}

function getVideoPublicIdFromUrl(url) {
    // Remove query params if any
    const baseUrl = url.split("?")[0];
    // Split the URL by '/' and extract the part before the extension
    const parts = baseUrl.split("/");
    const publicIdWithExtension = parts[parts.length - 1];
    const publicId = publicIdWithExtension.split(".")[0];
    return publicId;
}
//Function to delete a file from Cloudinary
const deleteFromCloudinary = async (publicId) => {
    try {
        if (!publicId) {
            throw new Error("Public ID is required to delete a file from Cloudinary");
        }
        // invalidate: true means that the file will be deleted immediately and CDN cache will be cleared   
        const result = await cloudinary.uploader.destroy(publicId, { invalidate: true });
        console.log("File deleted from Cloudinary:", result);
        return result;
    } catch (error) {
        console.log("Error deleting file from Cloudinary:", error);
        return null;
    }
};

const deleteVideoFromCloudinary = async (publicId) => {
    try {
        if (!publicId) {
            throw new Error("Public ID is required to delete a file from Cloudinary");
        }
        // invalidate: true means that the file will be deleted immediately and CDN cache will be cleared   
        const result = await cloudinary.uploader.destroy(publicId, {resource_type: "video", invalidate: true });
        console.log("File deleted from Cloudinary:", result);
        return result;
    } catch (error) {
        console.log("Error deleting file from Cloudinary:", error);
        return null;
    }
};
export {
    uploadOnCloudinary,
    getPublicIdFromUrl,
    deleteFromCloudinary,
    getVideoPublicIdFromUrl,
    deleteVideoFromCloudinary
};