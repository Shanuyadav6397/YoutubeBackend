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
import mongoose from "mongoose";

async function loginUser(userAuthDetails) {
    // 1. username or email and password are required
    const {userName, email, password} = userAuthDetails;
    if(!(userName || email)){
        throw new ApiError(400, "Username or email is required");
    }
    // 2. find the user with the given username or email
    const user = await findUser({
        $or: [{userName}, {email}]
    });
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
    // 4. if the password is valid then Generate the access token and refresh token
    const generateAccessToken = jwt.sign(
        {email: user.email, userName:user.userName, _id: user._id},
        JWT_ACCESS_TOKEN_EXPIRE,
        {expiresIn:JWT_ACCESS_TOKEN_EXPIRE}
    );

    const generateRefreshToken = jwt.sign(
        {_id: user._id},
        JWT_REFRESH_TOKEN_SECRET,
        {expiresIn: JWT_REFRESH_TOKEN_EXPIRE}
    );

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
    const user = await findUser({_id: decodedToken._id});
    if(!user){
        throw new ApiError(401, "Invalid refresh token, please login to get the access token");
    }
    if(user.refreshToken !== incomingRefreshTokwn){
        throw new ApiError(401, "Refresh token expired or used");
    }
    // 4. generate the new access token
    try {
        const generateAccessToken = jwt.sign(
            {email: user.email, userName:user.userName, _id: user._id},
            JWT_ACCESS_TOKEN_EXPIRE,
            {expiresIn:JWT_ACCESS_TOKEN_EXPIRE}
        );
        const generateRefreshToken = jwt.sign(
            {_id: user._id},
            JWT_REFRESH_TOKEN_SECRET,
            {expiresIn: JWT_REFRESH_TOKEN_EXPIRE}
        );
        user.refreshToken = generateRefreshToken;
        await user.save({validateBeforeSave: false});
        
    // 5. return the new access token
        return {generateAccessToken, generateRefreshToken};
    } catch (error) {
        throw new ApiError(500, "Internal server error, please try again");
    }
}

async function changePassword(userChangePasswordDetails){
    const { oldPassword, newPassword, confirmPassword } = userChangePasswordDetails.body;
    // 0. get the user
    const user = await findUser({_id: userChangePasswordDetails.userId});
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
    const { email } = accountDetails.email; 
    const { _id } = accountDetails.userId;
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
    const user = await updateUser({_id: _id}, {
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
    // 1. check if the avatar is provided
    const avatarLocalPath = avatarDetails.file.path;
    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is required");
    }
    // 2. upload the avatar to the cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if(!avatar.url){
        throw new ApiError(500, "Error when uploading the avatar on cloudinary");
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
    // 1. check if the cover image is provided
    const coverImageLocalPath = coverImageDetails.file.path;
    if(!coverImageLocalPath){
        throw new ApiError(400, "Cover Image is required");
    }
    // 2. upload the cover image to the cloudinary
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
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
    const channel = await aggergateUser(
        {
            // $match operator filters the documents
            $match: {userName: userName?.toLowerCase()}
        },
        {
            /* 
               $lookup operator performs a left outer join to an unsharded collection
               in the same database to filter in documents from the "joined" 
               collection for processing.
            */
           // 1st lookup that finds the subscribers of the channel
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            // 2nd lookup that finds the channels that the user is subscribed to
            $lookup:{
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            // $addFields operator adds new fields to the User document(schema).
            $addFields: {
                // $size operator returns the number of elements in the array.
                // we use $subscribers because it is the feild that contains the subscribers
                totalSubscribers: {$size: "$subscribers"},
                totalSubscribedTo: {$size: "$subscribedTo"},
                isSubscribed: {
                    // $cond operator is a ternary operator for subscribed or not
                    $cond: {
                        // $in operator checks if the user id is in the subscribers array
                        if:{$in: [userDetils.id, "$subscribers.subscriber"]},
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            // $project operator reshapes each document in the stream
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
    );
    if(!channel?.length){
        throw new NotFoundError("Channel");
    }
    // aggerdateUser returns an array of users, so we return the first user
    return channel[0];
}

async function getUserWatchHistory(userId){
    // 1. check if the user id is provided
    if(!userId){
        throw new ApiError(400, "User id is required");
    }
    // 2. find the user with the id and populate the watch history
    const user = await aggergateUser(
        {
            $match: {_id: new mongoose.Types.ObjectId(userId)} // convert the string id to object id
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup:{
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline:[
                                {
                                    $project: {
                                        firstName: 1,
                                        lastName: 1,
                                        userName: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: {$arrayElemAt: ["$owner", 0]} // owner: {$first: "$owner"}
                        }
                    },
                ]
            }
        }
    );
    if(!user?.length){
        throw new NotFoundError("User");
    }
    return user[0].watchHistory;
}

export { 
    loginUser,
    refreshAccessToken,
    changePassword,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getUserWatchHistory
};