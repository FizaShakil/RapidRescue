import { Router } from "express";
import { getMedicalProfileByUserId } from "../controllers/medicalProfile.controller.js";
import { verifyJWT, verifyRole } from "../middlewares/auth.middleware.js";

const medicalProfileRouter = Router();

medicalProfileRouter.use(verifyJWT, verifyRole("admin"));

medicalProfileRouter.get("/get-user-medical-profile/:userId", getMedicalProfileByUserId);

export default medicalProfileRouter;
