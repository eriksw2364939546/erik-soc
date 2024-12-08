import express from "express";
import { createUser, loginUser, authUser, addUserPhoto } from "../controllers/user.js";
import authMiddleware from "../middleware/auth.js";
import { uploadUserImage, processImage } from "../middleware/uploadUserImage.js";

const userRouter = express.Router()

userRouter.post("/register", createUser)
userRouter.post("/login", loginUser)
userRouter.post("/add-photo", authMiddleware, uploadUserImage.single('image'), processImage, addUserPhoto)
userRouter.post("/auth", authMiddleware, authUser)

export default userRouter
