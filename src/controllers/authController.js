import { loginUser } from "../services/authService.js";
import { ApiResponse } from "../utils/ApiResponse.js";
async function login(req, res) {
  try {
    const loginPayload = req.body;
    //console.log(loginPayload);
    const response = await loginUser(loginPayload);

    res.cookie("generateAccessToken", response, {
      httpOnly: true, // this cookie cannot be accessed by client side javascript
      secure: true,
    }).cookie("generateRefreshToken", response, {
      httpOnly: true,
      secure: true,
    });
    return res.status(200).json(new ApiResponse(200, "LoggedIn success", {}, {}),);
  } catch (error) {
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


export { login, logout };
