import express from "express";
import { createUser } from "../controllers/userController.js";
import { upload } from "../middlewares/multer.js";
const userRouter = express.Router();

// userRouter.post("/register", upload.fields([
//     { name: "avatar", maxCount: 1 },
//     { name: "coverImage", maxCount: 1 },
// ]), createUser);

userRouter.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 },
    ]),
    createUser
);

export { userRouter };