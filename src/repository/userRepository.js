import User from '../models/userModel.js';

async function findUser(parameters) {
    try {
        const response = await User.findOne({...parameters});
        return response;
    } catch (error) {
        console.log(error);
    }
}

async function createUser(userDetails) { 
    try {
        const User = await User.create(userDetails);
        return User;
    } catch (error) {
        console.log(error);
    }
}

export { createUser, findUser };