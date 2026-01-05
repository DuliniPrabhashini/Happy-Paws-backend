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

authRouter.post("/register", registerUser)

authRouter.post("/login", login)

authRouter.post("/admin/register", registerAdmin) 

authRouter.get("/getProfile",authenticate, getMyProfile) 

authRouter.post("/forget_password", forgetPassword)

authRouter.post("/refreshToken", refreshToken)

authRouter.post("/reset_password",forgetPassword)//work to done

export default authRouter

