import { uploadOnCloudinary } from "../config/cloudinaryConfig.js";
import { createUser, findUser } from "../repository/userRepository.js";
import { ApiError } from "../utils/ApiError.js";

async function registerUser(userDetails) {
  // Step-1 validate the user details
  if (
    [userDetails.email, userDetails.userName, userDetails.password].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw ApiError(400, "All fields are required");
  }

  /** Step-2 
     we will check user is already register or not with the give email and userName
     with the help of repository layer function findUser
  */

  const existUser = await findUser({
    $or: [{ email: userDetails.email }, { userName: userDetails.userName }],
  });

  // if user is register then return the error message
  if (existUser) {
    throw new ApiError(409,"User already exists with the given email or userName");
  }
  // Step-2 check avtar exists or not
  const avtarImageLocalPath = userDetails.avatar; // path of the avatar image
  const coverImageLocalPath = userDetails.coverImage; // path of the cover image
  
  if (!avtarImageLocalPath) {
    throw new ApiError(400, "Please provide avatar");
  }

  // Step-3  upload them to cloudinary
  const avatar = await uploadOnCloudinary(avtarImageLocalPath);
  if (!avatar) {
    throw new ApiError(500, "Something went wrong while uploading Avatar");
  }
  
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!(" " || coverImage)) {
    throw new ApiError(500, "Something went wrong while uploading coverImage");
  }


  // Step-4 create a new user
  const newUser = await createUser({
    ...userDetails,
    avatar: avatar.url,
    coverImage: coverImage?.url || " ",
  });

  // if user is not created then return the error message

  if (!newUser) {
    throw new ApiError(500, "Something went wrong while regstring user");
  }

  return newUser;
}
export { registerUser };
