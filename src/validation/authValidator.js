import jwt from "jsonwebtoken";
import { JWT_ACCESS_TOKEN_SECRET } from "../config/serverConfig.js";
import { ApiError } from "../utils/ApiError.js";



async function loggedIn(req, res, next){
    const token = req.cookies.generateAccessToken || req.headers("Authorization")?.replace("Bearer ", ""); // get the token from the cookie or from the header
    if(!token){
        return res.status(401).json(new ApiError(401, "Unauthorized", "Token is required", {}));
    }
    console.log("token ",token);
    try {
        console.log(JWT_ACCESS_TOKEN_SECRET);
        console.log("Reached try part");
        console.log(JWT_ACCESS_TOKEN_SECRET);
        const decodedToken = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);
        console.log("After decodedtoken");
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
        return res.status(401).json(new ApiError(401, "Unauthorized", "Invalid token2", {}));
    }
}


export {loggedIn}