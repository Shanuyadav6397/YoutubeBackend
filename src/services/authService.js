import { JWT_ACCESS_TOKEN_EXPIRE, JWT_REFRESH_TOKEN_EXPIRE, JWT_REFRESH_TOKEN_SECRET } from "../config/serverConfig.js";
import { findUser } from "../repository/userRepository.js";
import { ApiError } from "../utils/ApiError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NotFoundError } from "../utils/notFoundError.js";

async function loginUser(userAuthDetails) {
    // 1. username or email and password are required
    const {userName, email, password} = userAuthDetails;
    console.log(userName, email, password);
    if(!(userName || email)){
        throw new ApiError(400, "Username or email is required");
    }
    // 2. find the user with the given username or email
    const user = await findUser({
        $or: [{userName}, {email}]
    });
    console.log(user);
    // if the user not found
    if(!user){
        throw new NotFoundError("User");
    }
    // 3. if the user is found validate the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    // if the password is invalid
    if(!isPasswordValid){
        throw new ApiError(401, "Invalid password, please try again");
    }
    console.log(isPasswordValid);
    // 4. if the password is valid then Generate the access token and refresh token
    const generateAccessToken = jwt.sign(
        {email: user.email, userName:user.userName, id: user._id},
        JWT_ACCESS_TOKEN_EXPIRE,
        {expiresIn:JWT_ACCESS_TOKEN_EXPIRE}
    );
    console.log("Access Token",generateAccessToken);

    const generateRefreshToken = jwt.sign(
        {id: user._id},
        JWT_REFRESH_TOKEN_SECRET,
        {expiresIn: JWT_REFRESH_TOKEN_EXPIRE}
    );
    console.log("Refresh Token",generateRefreshToken);
    console.log(user._id);

    user.refreshToken = generateRefreshToken;
    await user.save({validateBeforeSave: false}); // save the refresh token in the database wihout validating the required fields
    // 5. return the token in secure cookie
    return {generateAccessToken, generateRefreshToken};
}

export {loginUser}