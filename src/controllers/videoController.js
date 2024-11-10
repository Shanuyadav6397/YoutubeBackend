import {
  deleteVideo,
  updateDescription,
  updateThumbnail,
  updateTitle,
  uploadVideo
} from "../services/videoService.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

  async function publishAVideo(req, res){
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

async function updateVideoThumbnail(req, res){
  try {
    const videoThumbnailDetails = await updateThumbnail({
      videoId:req.params.videoId,
      thumbnail:req.file,
      owner: req.user._id
  });
    return res
      .status(200)
      .json(new ApiResponse(200, "Thumbnail updated successfully", videoThumbnailDetails, null));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiError(error.statusCode, error.message, {}, error));
  }
}

async function updateVideoTitle(req, res){
  try {
    const videoTitle = await updateTitle({
      videoId:req.params.videoId,
      title:req.body.title,
      owner: req.user._id
  });
    return res
      .status(200)
      .json(new ApiResponse(200, "Video title updated successfully", videoTitle, null));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiError(error.statusCode, error.message, {}, error));
  }
}

async function updateVideoDescription(req, res){
  try {
    const videoDescription = await updateDescription({
      videoId:req.params.videoId,
      description:req.body.description,
      owner: req.user._id
  });
    return res
      .status(200)
      .json(new ApiResponse(200, "Video description updated successfully", videoDescription, null));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiError(error.statusCode, error.message, {}, error));
  }
}

async function deleteUserVideo(req, res){
  try {
    const video = await deleteVideo({
      _id:req.params.videoId,
      owner: req.user._id
  });
    return res
      .status(200)
      .json(new ApiResponse(200, "Video deleted successfully", video, null));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiError(error.statusCode, error.message, {}, error));
  }
}


export { 
  publishAVideo,
  updateVideoThumbnail,
  updateVideoTitle,
  updateVideoDescription,
  deleteUserVideo
};