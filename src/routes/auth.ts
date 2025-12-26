import { Router } from "express";
import {
    forgetPassword,
    getMyProfile,
    login,
    refreshToken,
    registerAdmin,
    registerUser
} from "../controller/auth.controller";
import { authenticate } from "../middleware/auth";

const authRouter = Router();

// register (only user) - public
authRouter.post("/register", registerUser)

// login - public
authRouter.post("/login", login)

// register (ADMIN) - admin only
authRouter.post("/admin/register", registerAdmin) //  middleware eka danna

// me - Admin & User both
authRouter.get("/getProfile",authenticate, getMyProfile) // middleware eka danna

// forget password
authRouter.post("/forget_password", forgetPassword)

// refresh
authRouter.post("/refresh", refreshToken)

export default authRouter

