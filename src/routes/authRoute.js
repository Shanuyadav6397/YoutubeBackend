import express from "express";
import { login, logout } from "../controllers/authController.js";
import { loggedIn } from "../validation/authValidator.js";
const loginRouter = express.Router();



loginRouter.route("/login").post(login);
loginRouter.route("/logout").post(loggedIn, logout);

export { loginRouter };
