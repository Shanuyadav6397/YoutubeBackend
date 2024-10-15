import { loginUser } from "../services/authService.js";
import { ApiResponse } from "../utils/ApiResponse.js";
async function login(req, res) {
  try {
    const loginPayload = req.body;
    //console.log(loginPayload);
    const response = await loginUser(loginPayload);

    res.cookie("accessToken", response, {
      httpOnly: true, // this cookie cannot be accessed by client side javascript
      secure: true,
    }).cookie("refreshToken", response, {
      httpOnly: true,
      secure: true,
    });
    return res.status(200).json(new ApiResponse(200, "LoggedIn success", {}, {}),);
  } catch (error) {
    return res.status(error.statusCode).json({
      success: false,
      data: {},
      message: error.message,
      error: error,
    });
  }
}

export { login };
