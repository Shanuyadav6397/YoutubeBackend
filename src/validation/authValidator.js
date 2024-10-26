import jwt from "jsonwebtoken";
import { JWT_ACCESS_TOKEN_SECRET } from "../config/serverConfig.js";
import { ApiError } from "../utils/ApiError.js";



async function loggedIn(req, res, next){
    const token = req.cookies.generateAccessToken || req.header("Authorization")?.replace("Bearer ", ""); // get the token from the cookie or from the header
    console.log("token ",token);
    if(!token){
        return res.status(401).json(new ApiError(401, "Unauthorized", "Token is required", {}));
    }
    console.log("token ",token);
    try {
        console.log("Reached try part");
        const decodedToken = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);
        console.log("decodedToken ",decodedToken);
        if (!decodedToken){
            return res.status(401).json(new ApiError(401, "Unauthorized", "Invalid token", {}));
        }
        req.user = {
            email: decodedToken.email,
            username: decodedToken.username,
            id: decodedToken.id
        }
        next();
    } catch (error) {
        // Check if the error is related to expiration
        if (error.name === 'TokenExpiredError') {
            message = "Token has expired";
        }
        console.log(error);
        return res.status(401).json(new ApiError(401, "Unauthorized", "Invalid token2", {}));
    }
}


export {loggedIn}