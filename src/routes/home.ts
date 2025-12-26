import { Router } from "express";
import { addPet, deletePet, getMyPet, updatePet } from "../controller/petDetails.controller";
import { authenticate } from "../middleware/auth";
import { upload } from "../middleware/upload";

const homeRouter = Router();

homeRouter.post("/addPet", authenticate, upload.single("image"), addPet)

homeRouter.post("/updatePet", authenticate, upload.single("image"), updatePet)

homeRouter.delete("/deletePet", authenticate, deletePet)

homeRouter.get("/getMyPet", authenticate, getMyPet)

export default homeRouter;