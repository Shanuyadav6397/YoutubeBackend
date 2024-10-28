import express from "express";
import { changeCurrentPassword, login, logout, refreshToken } from "../controllers/authController.js";
import { loggedIn } from "../validation/authValidator.js";
const loginRouter = express.Router();



loginRouter.route("/login").post(login);
loginRouter.route("/logout").post(loggedIn, logout);
loginRouter.route("/refreshToken").post(refreshToken);
loginRouter.route("/changePassword").patch( changeCurrentPassword);

export { loginRouter };
