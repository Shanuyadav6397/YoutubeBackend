import {
    JWT_ACCESS_TOKEN_EXPIRE,
    JWT_REFRESH_TOKEN_EXPIRE,
    JWT_REFRESH_TOKEN_SECRET
} from "../config/serverConfig.js";
import { findUser, updateUser, aggergateUser } from "../repository/userRepository.js";
import { ApiError } from "../utils/ApiError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NotFoundError } from "../utils/notFoundError.js";
import { uploadOnCloudinary } from "../config/cloudinaryConfig.js";

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
    console.log(user);
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

async function refreshAccessToken(userRefreshTokenDetails){
    // 1. check if the refresh token is provided
    const incomingRefreshTokwn = userRefreshTokenDetails.generateRefreshToken;
   if(!incomingRefreshTokwn){
       throw new ApiError(401, "unauthorized request");
    }
    // 2. verify the refresh token
    const decodedToken = jwt.verify(incomingRefreshTokwn, JWT_REFRESH_TOKEN_SECRET);
    if(!decodedToken){
        throw new ApiError(401, "unauthorized, please login to get the access token");
    }
    // 3. find the user with the id from the refresh token
    const user = await findUser({_id: decodedToken.id});
    if(!user){
        throw new ApiError(401, "Invalid refresh token, please login to get the access token");
    }
    if(user.refreshToken !== incomingRefreshTokwn){
        throw new ApiError(401, "Refresh token expired or used");
    }
    // 4. generate the new access token
    try {
        const generateAccessToken = jwt.sign(
            {email: user.email, userName:user.userName, id: user._id},
            JWT_ACCESS_TOKEN_EXPIRE,
            {expiresIn:JWT_ACCESS_TOKEN_EXPIRE}
        );
        // 5. return the new access token
        return generateAccessToken;
    } catch (error) {
        throw new ApiError(500, "Internal server error, please try again");
    }
}

async function changePassword(userChangePasswordDetails){
    const { oldPassword, newPassword, confirmPassword } = userChangePasswordDetails;
    // 0. get the user
    const user = await findUser({_id: userChangePasswordDetails.id});
    console.log(user);
    if(!user){
        throw new NotFoundError("User");
    }
    // 1. check the new password and confirm password are same
    if(newPassword !== confirmPassword){
        throw new ApiError(400, "New password and confirm password should be same");
    }
    // 2. check if the old password is valid
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if(!isPasswordValid){
        throw new ApiError(400, "Invalid password, please try again");
    }
    // 3. check if the new password is same as the old password
    if(newPassword === oldPassword){
        throw new ApiError(400, "New password should be different from the old password");
    }
    // 4. update the user password
    user.password = newPassword;
    // 5. save the user
    await user.save({ validateBeforeSave: false });
    return newPassword;

}

async function updateAccountDetails(accountDetails){
    // 1. check if the email is provided
    const { email, id } = accountDetails; 
    if(!email){
        throw new ApiError(400, "Email is required");
    }
    // 2. check if the email is already taken
    const userWithEmail = await findUser({email});
    if(userWithEmail){
        throw new ApiError(400, "Email is already taken");
    }
    const emailRegex =  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(!emailRegex.test(email)){
        throw new ApiError(400, "Please fill a valid email address");
    }
    // 3. find the user with the id and update the user email
    const user = await updateUser({_id: id}, {
        $set: {
            email:email
        }
     }
    );
    if(!user){
        throw new NotFoundError("User");
    }
    return user;
}

async function updateUserAvatar(avatarDetails){
    console.log(avatarDetails);
    // 1. check if the avatar is provided
    const avatarLocalPath = avatarDetails.file.path;
    console.log(avatarLocalPath);
    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is required");
    }
    // 2. upload the avatar to the cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    console.log(avatar.url);
    if(!avatar.url){
        throw new ApiError(500, "Error when  uploading the avatar on cloudinary");
    }
    // 3. find the user with the id and update the user avatar
    const user = await updateUser({_id: avatarDetails.id}, {
        $set: {
            avatar: avatar.url
        }
    });
    if(!user){
        throw new NotFoundError("User");
    }
    return user;
    
}

async function updateUserCoverImage(coverImageDetails){
    console.log(coverImageDetails);
    // 1. check if the cover image is provided
    const coverImageLocalPath = coverImageDetails.file.path;
    console.log(coverImageLocalPath);
    if(!coverImageLocalPath){
        throw new ApiError(400, "Cover Image is required");
    }
    // 2. upload the cover image to the cloudinary
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    console.log(coverImage.url);
    if(!coverImage.url){
        throw new ApiError(500, "Error when  uploading the cover Image on cloudinary");
    }
    // 3. find the user with the id and update the user avatar
    const user = await updateUser({_id: coverImageDetails.id}, {
        $set: {
            coverImage: coverImage.url
        }
    });
    if(!user){
        throw new NotFoundError("User");
    }
    return user;
    
}

 async function getUserChannelProfile(userDetils){
    // 1. check if the username is provided
    const { userName } = userDetils;
    if(!userName?.trim()){
        throw new ApiError(400, "Username is missing");
    } 
    // 2. find the user with the given username and populate the subscribers and subscribedTo
    const channel = await aggergateUser([
        {
            $match: {userName: userName?.toLowerCase()}
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup:{
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                totalSubscribers: {$size: "$subscribers"},
                totalSubscribedTo: {$size: "$subscribedTo"},
                isSubscribed: {
                    $cond: {
                        if:{$in: [userDetils.id, "$subscribers.subscriber"]},
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                userName: 1,
                firstName: 1,
                lastName: 1,
                totalSubscribers: 1,
                totalSubscribedTo: 1,
                avatar: 1,
                coverImage: 1,
                isSubscribed: 1,
                email: 1,
                createdAt: 1
            }
        }
    ]);
    if(!channel?.length){
        throw new NotFoundError("Channel");
    }
    return channel[0];
};

export { 
    loginUser,
    refreshAccessToken,
    changePassword,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile
};