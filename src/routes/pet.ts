import { Router } from "express";
import { addPet, deletePet, getMyPet, updatePet } from "../controller/pet.controller";
import { authenticate } from "../middleware/auth";
import { upload } from "../middleware/upload";

const petRouter = Router();

petRouter.post("/addPet", authenticate, upload.single("image"), addPet)

petRouter.post("/updatePet", authenticate, upload.single("image"), updatePet)

petRouter.delete("/deletePet", authenticate, deletePet)

petRouter.get("/getMyPet", authenticate, getMyPet)

export default petRouter;