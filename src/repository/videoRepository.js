import Video from "../schema/videoSchema.js";
import { ApiError } from "../utils/ApiError.js";

async function createVideo(videoDetails) {
    try {
        const newVideo = await Video.create(videoDetails);
        return newVideo;
    } catch (error) {
        console.log(error);
        throw new ApiError(500, error.message, {}, error);
    }
}

async function getVideoById(videoId) {
    try {
        const video = await Video.findById(videoId);
        return video;
    } catch (error) {
        console.log(error);
        throw new ApiError(500, error.message, {}, error);
    }
}

async function updateVideo(parameters, update) {
    try {
        const video = await Video.findByIdAndUpdate(parameters, update, {new: true});
        return video;
    } catch (error) {
        console.log(error);
        throw new ApiError(500, error.message, {}, error);
    }
}

async function deleteVideoDatabase(parameters) {
    try {
        const video = await Video.findByIdAndDelete(parameters);
        return video;
    } catch (error) {
        console.log(error);
        throw new ApiError(500, error.message, {}, error);
    }
}

export { createVideo, getVideoById, updateVideo, deleteVideoDatabase };