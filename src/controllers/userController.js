import { registerUser } from "../services/userService.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

async function createUser(req, res) {
    try {
        const newUser = await registerUser({
            userName: req.body.userName,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            avatar: req.file?.path,
            coverImage: req.file?.path,
            password: req.body.password,
          });
          return res.status(201).json(
            new ApiResponse(200, "User registered successfully", newUser, null)
        );
    } catch (error) {
        console.log(error);
        return ApiError(500, "Something went wrong");
    }
}

export {createUser};