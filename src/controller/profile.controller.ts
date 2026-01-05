import { Response } from "express";
import dotenv from "dotenv";
import { AuthRequest } from "../middleware/auth";
import { User } from "../models/user.model";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendEmail } from "../utils/emails";

dotenv.config();

export const getMyProfile = async (
  request: AuthRequest,
  response: Response
) => {
  try {
    const ownerId = request.user.sub || request.user._id;

    const profile = await User.find({ owner: ownerId }).sort({ createAt: -1 });
    console.log(profile);
    return response.status(200).json({
      profile,
    });
  } catch (error) {
    return response.status(500).json({ message: "Internal server error!" });
  }
};

export const updateMyProfile = async (
  request: AuthRequest,
  response: Response
) => {
  try {
    const profileId = request.user.sub || request.user._id;
    const { name } = request.body;
    const profilePhoto = request.file?.buffer;

    console.log(profileId, name, profilePhoto);

    const profile = await User.findById(profileId);

    if (!profile) {
      return response.status(404).json({ message: "Profile not found !" });
    }

    const updateFields: any = {};

    if (name) updateFields.name = name;

    if (profilePhoto) {
      const uploadImage = () => {
        return new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ resource_type: "image" }, (error, result) => {
              if (error) return reject(error);
              resolve(result);
            })
            .end(profilePhoto);
        });
      };

      const uploaded: any = await uploadImage();
      updateFields.imageUrl = uploaded.secure_url;
    }

    const updatedProfile = await User.findByIdAndUpdate(
      profileId,
      updateFields,
      {
        new: true,
      }
    );

    return response.status(200).json({
      message: "Profile updated successfully !",
      profile: updatedProfile,
    });
  } catch (error) {
    return response.status(500).json({ message: "Internal Server Error!" });
  }
};

export const deleteMyAccount = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.sub || req.user._id;
        const { email, password } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.email !== email) {
            return res.status(400).json({ message: "Email does not match" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }

        await User.findByIdAndDelete(userId);

        return res.status(200).json({
            message: "Account deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};


