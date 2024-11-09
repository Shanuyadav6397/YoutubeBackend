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

export { createVideo };