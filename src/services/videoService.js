import {
    deleteFromCloudinary,
    deleteVideoFromCloudinary,
    getPublicIdFromUrl,
    getVideoPublicIdFromUrl,
    uploadOnCloudinary
} from "../config/cloudinaryConfig.js";
import { createVideo, deleteVideoDatabase, getVideoById, updateVideo } from "../repository/videoRepository.js";
import { ApiError } from "../utils/ApiError.js";
import { NotFoundError } from "../utils/notFoundError.js";

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
        if (!thumbnailLocalPath) {
            throw new ApiError(400, "Please provide thumbnail image");
        }
        
        // Step-3  upload them to cloudinary
        const video = await uploadOnCloudinary(videoFileLocalPath);
        if (!video) {
            throw new ApiError(500, "Something went wrong while uploading video file");
        }
        // upload thumbnail image on cloudinary
        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
        if (!thumbnail) {
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

async function updateThumbnail(thumbnailDetails) {
    try {
        
        // step-1 validate the thumbnail details
        if (!thumbnailDetails.videoId) {
            throw new ApiError(400, "Video id is required");
        }
        if (!thumbnailDetails.thumbnail) {
            throw new ApiError(400, "Thumbnail image is required");
        }
        if (!thumbnailDetails.owner) {
            throw new ApiError(400, "Owner is required");
        }

        const thumbnailLocalPath = thumbnailDetails.thumbnail;
        if (!thumbnailLocalPath) {
            throw new ApiError(400, "Please provide thumbnail image");
        }
        // step-2 find video by given videoId
        const video = await getVideoById(thumbnailDetails.videoId);
        if (!video) {
            throw new NotFoundError("Video");
        }
        // step-3 check if the user is authorized to update the video
        if (video.owner.toString() !== thumbnailDetails.owner.toString()) {
            throw new ApiError(403, "You are not authorized to update this video");
        }
        // step-4 upload the thumbnail image on cloudinary
        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath.path);
        if (!thumbnail) {
            throw new ApiError(500, "Something went wrong while uploading thumbnail");
        }
        // step-5 delte the previous thumbnail image from cloudinary
        const previousThumbnail = video.thumbnail;
        const previousThumbnailPublicId = getPublicIdFromUrl(previousThumbnail);
        if (previousThumbnailPublicId) {
            // delete previous thumbnail from cloudinary
            await deleteFromCloudinary(previousThumbnailPublicId);
        }
        // step-6 update the video with new thumbnail
        const updatedThumbnail = await updateVideo({ _id: thumbnailDetails.videoId },{ 
            $set:{ thumbnail: thumbnail.url }
        });
        if (!updatedThumbnail) {
            throw new ApiError(500, "Something went wrong while updating thumbnail");
        }
        return updatedThumbnail;

    } catch (error) {
        console.log(error);
        throw new ApiError(error.statusCode, error.message, {}, error);
    }
}

async function updateTitle(titleDetails){
    try {
        // step-1 validate the title details
        if(!titleDetails.videoId){
            throw new ApiError(400, "Video is required");
        }
        if(!titleDetails.title){
            throw new ApiError(400, "Title is required");
        }
        if(!titleDetails.owner){
            throw new ApiError(400, "Owner is required");
        }
        // step-2 find video by given videoId
        const video = await getVideoById(titleDetails.videoId);
        if(!video){
            throw new NotFoundError("Video");
        }
        // step-3 check if the user is authorized to update the video
        if(video.owner.toString() !== titleDetails.owner.toString()){
            throw new ApiError(403, "You are not authorized to update this video");
        }
        // step-4 update the video title
        const updatedTitle = await updateVideo({_id: titleDetails.videoId},{
            $set:{ title: titleDetails.title }
        });
        if(!updatedTitle){
            throw new ApiError(500, "Something went wrong while updating title");
        }
        return updatedTitle;
    } catch (error) {
        console.log(error);
        throw new ApiError(error.statusCode, error.message, {}, error);
        
    }
}

async function updateDescription(descriptionDetails){
    try {
        // step-1 validate the description details
        if(!descriptionDetails.videoId){
            throw new ApiError(400, "Video is required");
        }
        if(!descriptionDetails.description){
            throw new ApiError(400, "Description is required");
        }
        if(!descriptionDetails.owner){
            throw new ApiError(400, "Owner is required");
        }
        // step-2 find video by given videoId
        const video = await getVideoById(descriptionDetails.videoId);
        if(!video){
            throw new NotFoundError("Video");
        }
        // step-3 check if the user is authorized to update the video
        if(video.owner.toString() !== descriptionDetails.owner.toString()){
            throw new ApiError(403, "You are not authorized to update this video");
        }
        // step-4 update the video description
        const updatedDescription = await updateVideo({_id: descriptionDetails.videoId},{
            $set:{ description: descriptionDetails.description }
        });
        if(!updatedDescription){
            throw new ApiError(500, "Something went wrong while updating description");
        }
        return updatedDescription;
    }
    catch (error) {
        console.log(error);
        throw new ApiError(error.statusCode, error.message, {}, error);
    }
}

async function deleteVideo(videoDetails){
    try {
        // step-1 validate the video details
        if(!videoDetails._id){
            throw new ApiError(400, "Video id is required");
        }
        if(!videoDetails.owner){
            throw new ApiError(400, "Owner is required");
        }
        // step-2 find video by given videoId
        const video = await getVideoById(videoDetails._id);
        if(!video){
            throw new NotFoundError("Video");
        }
        // step-3 check if the user is authorized to delete the video
        if(video.owner.toString() !== videoDetails.owner.toString()){
            throw new ApiError(403, "You are not authorized to delete this video");
        }
        // step-4 find the public id of the video file and thumbnail
        const videoPublicId = getVideoPublicIdFromUrl(video.videoFile);
        if(!videoPublicId){
            throw new ApiError(500, "Something went wrong while get the video public id");
        }
        const thumbnailPublicId = getPublicIdFromUrl(video.thumbnail);
        if(!thumbnailPublicId){
            throw new ApiError(500, "Something went wrong while get the thumbnail public id");
        }
        // step-5 delete video file and thumbnail from cloudinary
        if(thumbnailPublicId){
            await deleteFromCloudinary(thumbnailPublicId);
        }

        if(videoPublicId){
            await deleteVideoFromCloudinary(videoPublicId);
        }
        // step-6 delete the video from database
        const deletedVideo = await deleteVideoDatabase(videoDetails._id);
        if(!deletedVideo){
            throw new ApiError(500, "Something went wrong while deleting video");
        }
        return deletedVideo;
    } catch (error) {
        console.log(error);
        throw new ApiError(error.statusCode, error.message, {}, error);
    }
}

export {
    uploadVideo,
    updateThumbnail,
    updateTitle,
    updateDescription,
    deleteVideo
};