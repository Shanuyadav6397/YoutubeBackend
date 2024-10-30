import express from "express";
import {
    changeCurrentPassword,
    login,
    logout,
    refreshToken,
    updateUser,
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
authRouter.route("/changePassword").patch(changeCurrentPassword);
authRouter.route("/updateDetails").patch(updateUser);
authRouter.route("/updateAvatar").patch(upload.single("avatar"), updateAvatar);
authRouter.route("/updateCoverImage").patch(upload.single("coverImage"), updateCoverImage);
authRouter.route("/channel/:userName").get(getChannelProfile);
authRouter.route("/watchHistory").get(getWatchHistory);



export { authRouter };