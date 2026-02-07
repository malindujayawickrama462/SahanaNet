import express from "express";
import { getUserByID, loginUser, RegisterUser } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register",RegisterUser);
userRouter.post("/login",loginUser);
userRouter.get("/:ID",getUserByID);

export default userRouter;
