import express from "express";
import { getUserByID, loginUser, RegisterUser } from "../controllers/userController.js";
import { getProfile, updateProfile, changePassword, getAllUsers, deleteUser } from "../controllers/authController.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";

const userRouter = express.Router();

// Public routes (No authentication required)
userRouter.post("/register", RegisterUser);
userRouter.post("/login", loginUser);

// Protected routes (Authentication required)
userRouter.get("/profile", authenticate, getProfile);
userRouter.put("/profile", authenticate, updateProfile);
userRouter.post("/change-password", authenticate, changePassword);

// Admin only routes
userRouter.get("/all-users", authenticate, authorize("admin"), getAllUsers);
userRouter.delete("/:id", authenticate, authorize("admin"), deleteUser);

// Generic user lookup (Admin only)
userRouter.get("/:ID", authenticate, authorize("admin"), getUserByID);

export default userRouter;
