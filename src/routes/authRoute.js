import express from "express";
import {
    changeCurrentPassword,
    login,
    logout,
    refreshToken,
    updateUserDetails,
    updateAvatar,
    updateCoverImage,
    getChannelProfile,
    getWatchHistory
} from "../controllers/authController.js";
import { loggedIn } from "../validation/authValidator.js";
import { upload } from "../middlewares/multer.js";
const authRouter = express.Router();



authRouter.route("/login").post(login);
authRouter.route("/logout").post(loggedIn, logout);
authRouter.route("/refreshToken").post(refreshToken);
authRouter.route("/changePassword").patch(loggedIn, changeCurrentPassword);
authRouter.route("/updateDetails").patch(loggedIn, updateUserDetails);
authRouter.route("/updateAvatar").patch(loggedIn, upload.single("avatar"), updateAvatar);
authRouter.route("/updateCoverImage").patch(loggedIn, upload.single("coverImage"), updateCoverImage);
authRouter.route("/channel/:userName").get(loggedIn, getChannelProfile);
authRouter.route("/watchHistory").get(loggedIn, getWatchHistory);



export { authRouter };