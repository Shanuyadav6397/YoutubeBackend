import express from "express";
import { login } from "../controllers/authController.js";
const loginRouter = express.Router();



loginRouter.route("/login").post(login);

export { loginRouter };
