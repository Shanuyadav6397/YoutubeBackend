import { JWT_ACCESS_TOKEN_EXPIRE, JWT_REFRESH_TOKEN_EXPIRE, JWT_REFRESH_TOKEN_SECRET } from "../config/serverConfig.js";
import { findUser } from "../repository/userRepository.js";
import { ApiError } from "../utils/ApiError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

async function loginUser(userAuthDetails) {
    // 1. username or email and password are required
    const {userName, email, password} = userAuthDetails;
    console.log(userName, email, password);
    if(!userName || !email){
        throw new ApiError(400, "Username or email is required");
    }
    // 2. find the user with the given username or email
    const user = await findUser({
        $or: [{userName}, {email}]
    });
    console.log(user);
    // if the user not found
    if(!user){
        throw new ApiError(404, "User does not exist");
    }
    // 3. validate the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    // if the password is invalid
    if(!isPasswordValid){
        throw new ApiError(401, "Invalid password, please try again");
    }
    console.log(isPasswordValid);
    // 4. generate a token
    const accessToken = jwt.sign(
        {email: user.email, userName:user.userName, id: user._id},
        JWT_ACCESS_TOKEN_EXPIRE,
        {expiresIn:JWT_ACCESS_TOKEN_EXPIRE}
    );
    console.log(accessToken);

    const refreshToken = jwt.sign(
        {id: user._id},
        JWT_REFRESH_TOKEN_SECRET,
        {expiresIn: JWT_REFRESH_TOKEN_EXPIRE}
    );
    console.log(refreshToken);

    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave: false});
    // 5. return the token in secure cookie
    return {accessToken, refreshToken};
}

export {loginUser}