import { Router } from "express";
import {
    createAmbulance,
    getAllAmbulances,
    getAvailableAmbulances,
    getAmbulanceById,
    updateAmbulance,
    deleteAmbulance,
} from "../controllers/ambulance.controller.js";
import { verifyJWT, verifyRole } from "../middlewares/auth.middleware.js";

const ambulanceRouter = Router();

ambulanceRouter.use(verifyJWT, verifyRole("admin"));

ambulanceRouter.get("/available-ambulances", getAvailableAmbulances);  // before /:id to avoid shadowing
ambulanceRouter.get("/get-all-ambulances", getAllAmbulances);
ambulanceRouter.post("/add-ambulance", createAmbulance);
ambulanceRouter.get("/get-ambulance-data/:id", getAmbulanceById);
ambulanceRouter.patch("/update-ambulance-data/:id", updateAmbulance);
ambulanceRouter.delete("/delete-ambulance/:id", deleteAmbulance);

export default ambulanceRouter;
