import User from '../schema/userSchema.js';

//first we wiil check if the user already exists in the database
async function findUser(parameters) {
    try {
        const existUser = await User.findOne({...parameters}).select("-password");
        return existUser;
    } catch (error) {
        console.log(error);
    }
}

//if the user does not exist in the database, we will create a new user
async function createUser(userDetails) { 
    try {
        const newUser = await User.create(userDetails).select("-password");
        return newUser;
    } catch (error) {
        console.log(error);
    }
}

async function updateUser(parameters, update) {
    try {
        const updatedUser = await User.findByIdAndUpdate(parameters, update, {new: true}).select("-password");
        return updatedUser;
    }
    catch (error) {
        console.log(error);
    }
}

export { createUser, findUser, updateUser };