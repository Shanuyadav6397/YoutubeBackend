import { findUser } from "../repository/userRepository.js";

// first we will check user is already register or not with the give email and
async function registerUser(userDetails) {
    const userByEmail = await findUser({
        email: userDetails.email
    });
}
// if user is register then return the error message
if (userByEmail) {
    throw ("User already exists with the given email", statusCode=400);
}
// if user is not register then create the user in the database
const newUser = await createUser({
    userName: userDetails.userName,
    firstName: userDetails.firstName,
    lastName: userDetails.lastName,
    email: userDetails.email,
    avatar: userDetails.avatar,
    coverImage: userDetails.coverImage,
    watchHistory: userDetails.watchHistory,
    password: userDetails.password,
});

// if user is not created then return the error message

if(!newUser) {
    throw ("Something went wrong while creating user", statusCode=500);
}

return newUser;

export { registerUser };