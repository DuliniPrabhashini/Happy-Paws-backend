import express from "express";
import { authenticate } from "../middleware/auth";
import {
  addPetDetail,
  deletePetDetail,
  getPetDetails,
  getMyPetDetails,
} from "../controller/petDetails.controller";

const petDetailsRouter = express.Router();

petDetailsRouter.post("/addPetDetail", authenticate, addPetDetail);
petDetailsRouter.delete("/deletePetDetail", authenticate, deletePetDetail);
petDetailsRouter.get("/by-pet/:petId", authenticate, getPetDetails);
petDetailsRouter.get("/getMyPetDetails/:petId", authenticate, getMyPetDetails);

export default petDetailsRouter;
