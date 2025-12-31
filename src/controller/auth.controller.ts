import { Request, Response } from 'express';
import { IUSER, ROLE, User } from '../models/user.model';
import bcrypt from "bcryptjs"
import { signAccessToken, signRefreshToken } from '../utils/tokens';
import { AuthRequest } from '../middleware/auth';
import jwt from "jsonwebtoken"

const JWT_ACCESS_SECRET = process.env.JWT_SECRET as string
export const registerUser = async (request: Request, res: Response) => {
   try {
       const { name, email, password } = request.body
       
       const existingUser = await User.findOne({ email })

       if (existingUser) {
           return res.status(400).json({ message: "Email exists" })
       }

       const hash = await bcrypt.hash(password, 10)

     const user = await User.create({
      name,
      email,
      password: hash,
      roles: [ROLE.USER]
    })

     res.status(201).json({
      message: "User registed",
      data: { email: user.email, roles: user.roles }
    })
    
   } catch (error) {
    console.error(error)
    res.status(500).json({
      message: "Internal; server error"
      
    })
   }
}

export const registerAdmin = async (request: Request, response: Response) => {
   try {
    const { email, password } = request.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return response.status(400).json({ message: "Email exists" })
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await User.create({
      email,
      password: hash,
      roles: [ROLE.ADMIN]
    })

    response.status(201).json({
      message: "Admin registed",
      data: { email: user.email, roles: user.roles }
    })
  } catch (err) {
    console.error(err)
    response.status(500).json({
      message: "Internal server error"
    })
  }
}

export const login = async (request: Request, response: Response) => {
   try {
    const { email, password } = request.body

    const existingUser = (await User.findOne({ email })) as IUSER | null
    if (!existingUser) {
      return response.status(401).json({ message: "Invalid credentials" })
    }

    const valid = await bcrypt.compare(password, existingUser.password)
    if (!valid) {
      return response.status(401).json({ message: "Invalid credentials" })
    }

     const accessToken = signAccessToken(existingUser)
     const refreshToken = signRefreshToken(existingUser)

     console.log("success")
    response.status(200).json({
      message: "success",
      accessToken,
      refreshToken,
      data: {
        email: existingUser.email,
        roles: existingUser.roles,
        name: existingUser.name,
        imageUrl: existingUser.imageUrl || null,        
      }
    })
  } catch (error) {
    console.error(error)
    response.status(500).json({
      message: "Internal server error"
    })
  }
}

export const logout = async (request: Request, response: Response) => { 

}

export const getMyProfile = async (request: AuthRequest, response: Response) => {
    if (!request.user) {
    return response.status(401).json({ message: "Unauthorized" })
  }
  const user = await User.findById(request.user.sub).select("-password")

  if (!user) {
    return response.status(404).json({
      message: "User not found"
    })
  }

  const { email, roles, _id } = user as IUSER

  response.status(200).json({ message: "ok", data: { id: _id, email, roles } })
}

export const forgetPassword = async (request: Request, response: Response) => {
  try {
    const { email, newPassword } = request.body

    const existingUser = (await User.findOne({ email })) as IUSER | null
    if (!existingUser) {
      return response.status(401).json({ message: "User not found for the provided email !" })  
    }

    const hash = await bcrypt.hash(newPassword, 10)
    existingUser.password = hash
    await existingUser.save()
    response.status(200).json({ message: "Password reset successfully !" })
    
  } catch (error) {
    response.status(500).json({message: "Internal server error!"})
  }
}
export const refreshToken = async(request: Request, response: Response) => {
  try {
    const { token } = request.body
    if (!token) {
      return response.status(400).json({ message: "Token required!" })
    }

    const payload = jwt.verify(token, JWT_ACCESS_SECRET)

    const user = await User.findById(payload.sub)

    if (!user) {
      return response.status(403).json({message: "User not found or no user logged in !"})
    }

    const accessToken = signAccessToken(user)
    response.status(200).json({ accessToken })
    
  } catch (error) {
    response.status(403).json({
      message: "Invalid or expired token!"
    })
  }
}



