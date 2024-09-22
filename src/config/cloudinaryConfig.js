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
        // File is uploaded on cloudinary
        console.log("File is uploaded on cloudinary");
        console.log(response);
        console.log(response.url);
        return response;
    } catch (error) {
        fs.unlinkSync(LocalFilePath); // delete the file from local storage
        console.log(error);
        return null;
        
    }
}

export {uploadOnCloudinary};