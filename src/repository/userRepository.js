import User from '../schema/userSchema.js';

//first we wiil check if the user already exists in the database
async function findUser(parameters) {
    try {
        const existUser = await User.findOne({...parameters});
        return existUser;
    } catch (error) {
        console.log(error);
    }
}

//if the user does not exist in the database, we will create a new user
async function createUser(userDetails) { 
    try {
        const newUser = await User.create(userDetails);
        return newUser;
    } catch (error) {
        console.log(error);
    }
}

export { createUser, findUser };