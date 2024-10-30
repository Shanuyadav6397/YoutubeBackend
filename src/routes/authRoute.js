import express from "express";
import {
    changeCurrentPassword,
    login,
    logout,
    refreshToken,
    updateUser,
    updateAvatar,
    updateCoverImage,
    getChannelProfile
} from "../controllers/authController.js";
import { loggedIn } from "../validation/authValidator.js";
import { upload } from "../middlewares/multer.js";
const loginRouter = express.Router();



loginRouter.route("/login").post(login);
loginRouter.route("/logout").post(loggedIn, logout);
loginRouter.route("/refreshToken").post(refreshToken);
loginRouter.route("/changePassword").patch( changeCurrentPassword);
loginRouter.route("/updateDetails").patch(updateUser);
loginRouter.route("/updateAvatar").patch(upload.single("avatar"), updateAvatar);
loginRouter.route("/updateCoverImage").patch(upload.single("coverImage"), updateCoverImage);
loginRouter.route("/").patch(getChannelProfile);



export { loginRouter };