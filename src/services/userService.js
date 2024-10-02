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

  /** Step-2 we will check user is already register or not with the give email and userName
             with the help of repository layer function findUser*/

  const existUser = await findUser({
    $or: [{ email: userDetails.email }, { userName: userDetails.userName }],
  });

  // if user is register then return the error message
  if (existUser) {
    throw new ApiError(409,"User already exists with the given email or userName");
  }
  // Step-2 check avtar and coverImages exists or not
  const avtarImageLocalPath = userDetails.avatar; // path of the avatar image
  const coverImageLocalPath = userDetails.coverImage; // path of the cover image
  //let coverImageLocalPath;
  // if(userDetails.files && Array.isArray(userDetails.files.coverImage) && userDetails.files.coverImage.length > 0){
  //   coverImageLocalPath = userDetails.files.coverImage[0].path;
  // }
  console.log(userDetails);
  if (!avtarImageLocalPath) {
    throw new ApiError(400, "Please provide avatar");
  }

  

  // Step-3  upload them to cloudinary
  const avatar = await uploadOnCloudinary(avtarImageLocalPath);
  console.log("avatar local image path ",avtarImageLocalPath)
  console.log("avatar",avatar);
  // if(coverImageLocalPath){
  //   const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  // }
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  console.log("coverImage",coverImage);

  if (!avatar) {
    throw new ApiError(500, "Something went wrong while uploading Avatar");
  }

  // Step-4 create a new user
  const newUser = await createUser({
    ...userDetails,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  // if user is not created then return the error message

  if (!newUser) {
    throw new ApiError(500, "Something went wrong while regstring user");
  }

  return newUser;
}
export { registerUser };
