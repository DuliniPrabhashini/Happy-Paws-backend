import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { upload } from "../middleware/upload";
import {
  deleteMyAccount,
  updateMyProfile,
} from "../controller/profile.controller";
import { getMyProfile } from "../controller/profile.controller";

const profileRouter = Router();

profileRouter.post(
  "/updateProfile",
  authenticate,
  upload.single("image"),
  updateMyProfile
);

profileRouter.get("/getMyProfile", authenticate, getMyProfile);

profileRouter.delete("/deleteAccount", authenticate, deleteMyAccount);

export default profileRouter;
