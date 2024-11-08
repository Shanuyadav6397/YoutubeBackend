import jwt from "jsonwebtoken";
import { JWT_ACCESS_TOKEN_SECRET } from "../config/serverConfig.js";
import { ApiError } from "../utils/ApiError.js";
import { findUser } from "../repository/userRepository.js";



async function loggedIn(req, res, next){
    const token = req.cookies.generateAccessToken; // get the token from the cookie or from the header
    if(!token){
        return res.status(401).json(new ApiError(401, "Unauthorized", "Token is required", {}));
    }
    try {
        const decodedToken = jwt.verify(token.generateRefreshToken, JWT_ACCESS_TOKEN_SECRET);
        if (!decodedToken){
            return res.status(401).json(new ApiError(401, "Unauthorized", "Invalid token", {}));
        }
        const user = await findUser(decodedToken.id);
        if (!user){
            return res.status(401).json(new ApiError(401, "Unauthorized", "Invalid Access token", {}));
        }
        req.user = user;
        next();
    } catch (error) {
        // Check if the error is related to expiration
        if (error.name === 'TokenExpiredError') {
            message = "Token has expired";
        }
        console.log(error);
        return res.status(401).json(new ApiError(401, "Unauthorized", "Invalid token", {}));
    }
}


export {loggedIn}