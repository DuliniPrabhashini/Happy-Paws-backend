import { IUSER } from "../models/user.model"
import dotenv from "dotenv"
import jwt from "jsonwebtoken"

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET as string

export const signAccessToken = (user: IUSER): string => {
    return jwt.sign({ sub: user._id.toString(), roles: user.roles },
        JWT_SECRET,
        { expiresIn: "7d" })
}

export const signRefreshToken = (user: IUSER): string => {
    return jwt.sign({ sub: user._id.toString() },
        JWT_SECRET,
    { expiresIn: "7d"})
}