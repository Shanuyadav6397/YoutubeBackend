// import jwt from "jsonwebtoken";
// import { JWT_ACCESS_TOKEN_SECRET } from "../config/serverConfig.js";
// import { ApiError } from "../utils/ApiError.js";



// async function loggedIn(req, res, next){
//     token = req.cookies["accessToken"];
//     if(!token){
//         return res.status(401).json(new ApiError(401, "Unauthorized", "Token is required", {}));
//     }
//     try {
//         const decoded = jwt.verify(toekn, JWT_ACCESS_TOKEN_SECRET);
//         if (!decoded){
//             return res.status(401).json(new ApiError(401, "Unauthorized", "Invalid token", {}));
//         }
//         req.user = {
//             email: decoded.email,
//             username: decoded.username,
//             id: decoded.id
//         }
//         next();
//     } catch (error) {
//         return res.status(401).json(new ApiError(401, "Unauthorized", "Invalid token", {}));
//     }
// }


// export {loggedIn}