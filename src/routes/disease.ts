import { Router } from "express";
import { upload } from "../middleware/upload";
import { authenticate } from "../middleware/auth";
import { deleteDisease, getAllDiseases, getAllDiseasesByUser, postDiseases, updateDisease } from "../controller/diseases.controller";

const diseaseRouter = Router();

diseaseRouter.post("/addDisease",authenticate,upload.single("image"),postDiseases)

diseaseRouter.post("/updateDisease",authenticate,upload.single("image"),updateDisease)

diseaseRouter.delete("/deleteDisease/:diseaseId",authenticate ,deleteDisease)

diseaseRouter.get("/getAllDisease",authenticate ,getAllDiseases)

diseaseRouter.get("/getAllDiseasesByUser",authenticate ,getAllDiseasesByUser)

export default diseaseRouter