import { changePassword, loginUser, refreshAccessToken, updateAccountDetails } from "../services/authService.js";
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
    return res.status(200).json(new ApiResponse(200, "LoggedIn success", response, {}),);
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
    return res.status(500).json(new ApiResponse(error.statusCode, error.message, {}, error));
  }
}

async function logout(req, res){
  await updatedUser(req.user.id, {generateRefreshToken: undefined});
  res.clearCookie("generateAccessToken", response, {
    httpOnly: true,
    secure: true,
  }).clearCookie("generateRefreshToken", response, {
    httpOnly: true,
    secure: true,
  });
  return res.status(200).json(new ApiResponse(200, "Logged out successfully", {}, {}));
  
}

async function changeCurrentPassword(req, res){
  try {
    const changePasswordPayload = req.body;
    console.log(changePasswordPayload);
    const response = await changePassword(changePasswordPayload);
    return res.status(200).json(new ApiResponse(200, "Password changed successfully", response, {}));
  } catch (error) {
    console.log(error);
    return res.status(500).json(new ApiResponse(error.statusCode, error.message, {}, error));
    
  }
}

async function  updateUser(req, res) {
  try {
    const user = req.body;
    const response = await updateAccountDetails(user);
    return res.status(200).json(new ApiResponse(200, "User details updated successfully", response, {}));
  } catch (error) {
    console.log(error);
    return res.status(500).json(new ApiResponse(error.statusCode, error.message, {}, error));
    
  }
}

export { login, refreshToken, logout, changeCurrentPassword, updateUser };
