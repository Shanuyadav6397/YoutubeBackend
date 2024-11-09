import { uploadVideo } from "../services/videoService.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const publishAVideo = async (req, res) => {
    console.log(req.files?.videoFile?.[0]?.path)
  try {
    const newVideo = await uploadVideo({
      title: req.body.title,
      description: req.body.description,
      videoFile: req.files?.videoFile?.[0]?.path,
      thumbnail: req.files?.thumbnail?.[0]?.path,
      owner: req.user._id
    });
    return res
      .status(201)
      .json(new ApiResponse(200, "Video uploaded successfully", newVideo, null));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiError(error.statusCode, error.message, {}, error));
  }
}

export { publishAVideo };