import { uploadOnCloudinary } from "../config/cloudinaryConfig.js";
import { createVideo } from "../repository/videoRepository.js";
import { ApiError } from "../utils/ApiError.js";

async function uploadVideo(videoData) {
    try {
        // Step-1 validate the video details
        if([videoData.title, videoData.description, videoData.videoFile].some((field) => field?.trim() === "")) {
            throw new ApiError(400, "All fields are required");
        }
        if(!videoData.owner) {
            throw new ApiError(400, "Video owner is required");
        }        
        
        // Step-2 check video thumbnail exists or not
        const videoFileLocalPath = videoData.videoFile; // path of the video file
        const thumbnailLocalPath = videoData.thumbnail; // path of the thumbnail image
        
        if (!videoFileLocalPath) {
            throw new ApiError(400, "Please provide video file");
        }
        
        // Step-3  upload them to cloudinary
        const video = await uploadOnCloudinary(videoFileLocalPath);
        if (!video) {
            throw new ApiError(500, "Something went wrong while uploading video file");
        }
        // upload thumbnail image on cloudinary
        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
        if (!(" " || thumbnail)) {
            throw new ApiError(500, "Something went wrong while uploading thumbnail");
        }
        
        // Step-4 create a new video
        const newVideo = await createVideo({
            ...videoData,
            videoFile: video.url,
            thumbnail: thumbnail?.url || " ",
        });
        
        // if video is not created then return the error message
        if (!newVideo) {
            throw new ApiError(500, "Something went wrong while uploading video");
        }
        
        return newVideo;
    } catch (error) {
        console.log(error);
        throw new ApiError(error.statusCode, error.message, {}, error);
    }
    }



export { uploadVideo };