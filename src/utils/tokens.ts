import { IUSER } from "../models/user.model"
import dotenv from "dotenv"
import jwt from "jsonwebtoken"

dotenv.config()

const ACCESS_SECRET = process.env.JWT_SECRET as string;
const REFRESH_SECRET = process.env.REFRESH_SECRET as string;

export const signAccessToken = (user: IUSER): string => {
    return jwt.sign({ sub: user._id.toString(), roles: user.roles },
        ACCESS_SECRET,
        { expiresIn: "15m" })
}

export const signRefreshToken = (user: IUSER): string => {
    return jwt.sign({ sub: user._id.toString() },
        REFRESH_SECRET,
    { expiresIn: "7d"})
}