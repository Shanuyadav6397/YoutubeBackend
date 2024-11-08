import {
  changePassword,
  loginUser,
  refreshAccessToken,
  updateAccountDetails,
  updateUserAvatar,
  getUserChannelProfile,
  getUserWatchHistory 
} from "../services/authService.js";
import {updateUser} from "../repository/userRepository.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
async function login(req, res) {
  try {
    const loginPayload = req.body;
    //console.log(loginPayload);
    const response = await loginUser(loginPayload);

    res.cookie('generateAccessToken', response, {
      httpOnly: true, // this cookie cannot be accessed by client side javascript
      secure: true,
    }).cookie('generateRefreshToken', response, {
      httpOnly: true,
      secure: true,
    });
    return res.status(200).json(new ApiError(200, "LoggedIn success", response, {}),);
  } catch (error) {
    console.log(error);
    return res.status(500).json(new ApiResponse(error.statusCode, error.message, {}, error));
  }
}

async function refreshToken(req, res) {
  try {
    const refreshToken = req.cookies.generateRefreshToken || req.body.generateRefreshToken;
    console.log(refreshToken);
    const response = await refreshAccessToken(refreshToken);
    res.cookie('generateAccessToken', response, {
      httpOnly: true, // this cookie cannot be accessed by client side javascript
      secure: true,
    }).cookie('generateRefreshToken', response, {
      httpOnly: true,
      secure: true,
    });
    return res.status(200).json(new ApiResponse(200, "Access Token refreshed", response, {}),);
  } catch (error) {
    console.log(error);
    return res.status(500).json(new ApiError(error.statusCode, error.message, {}, error));
  }
}

async function logout(req, res){
  await updateUser(req.user._id,
    {
      $unset: { refreshToken:1}
    }
  )
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res.status(200)
  .clearCookie("generateAccessToken", options)
  .clearCookie("generateRefreshToken", options)
  .json(new ApiResponse(200, "Log out successfull", {}, {}));
  
}

async function changeCurrentPassword(req, res){
  try {
    const response = await changePassword({body:req.body, userId: req.user._id});
    return res.status(200).json(new ApiResponse(200, "Password changed successfully", response, {}));
  } catch (error) {
    console.log(error);
    return res.status(500).json(new ApiError(error.statusCode, error.message, {}, error));
    
  }
}

async function  updateUserDetails(req, res) {
  try {
    const user = {email:req.body, userId:req.user};
    const response = await updateAccountDetails(user);
    return res.status(200).json(new ApiResponse(200, "User details updated successfully", response, {}));
  } catch (error) {
    console.log(error);
    return res.status(500).json(new ApiError(error.statusCode, error.message, {}, error));
    
  }
}
 async function updateAvatar(req, res){
  try {
    const user = await updateUserAvatar({ id: req.body.id, file: req.file }); 
    return res.status(200).json(new ApiResponse(200, "User avatar updated successfully", user, {}));
  } catch (error) {
    console.log(error);
    return res.status(500).json(new ApiError(error.statusCode, error.message, {}, error));
    
  }
 }
 async function updateCoverImage(req, res){
  try {
    const user = await updateUserCoverImage({ id: req.body.id, file: req.file }); 
    return res.status(200).json(new ApiResponse(200, "User cover image updated successfully", user, {}));
  } catch (error) {
    console.log(error);
    return res.status(500).json(new ApiError(error.statusCode, error.message, {}, error));
    
  }
 }

 async function getChannelProfile(req, res){
  try {
    const user = await getUserChannelProfile({userName:req.params.userName});
    return res.status(200).json(new ApiResponse(200, "Channel profile fetched successfully", user, {}));
  } catch (error) {
    console.log(error);
    return res.status(500).json(new ApiError(error.statusCode, error.message, {}, error));
    
  }
 }

 async function getWatchHistory(req, res){
  try {
    console.log(req.user);
    const user = await getUserWatchHistory(req.user._id);
    return res.status(200).json(new ApiResponse(200, "Watch history fetched successfully", user, {}));
  } catch (error) {
    console.log(error);
    return res.status(500).json(new ApiError(error.statusCode, error.message, {}, error));
    
  }
 }

export {
  login,
  refreshToken,
  logout,
  changeCurrentPassword,
  updateUserDetails,
  updateAvatar,
  updateCoverImage,
  getChannelProfile,
  getWatchHistory
};
