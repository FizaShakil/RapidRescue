import { Router } from "express";
import {
    getAllFeedback,
    toggleFeedbackVisibility,
} from "../controllers/feedback.controller.js";
import { verifyJWT, verifyRole } from "../middlewares/auth.middleware.js";

const feedbackRouter = Router();

feedbackRouter.use(verifyJWT, verifyRole("admin"));

feedbackRouter.get("/all-feedback", getAllFeedback);
feedbackRouter.patch("/toggle-feedback-visibility/:id", toggleFeedbackVisibility);

export default feedbackRouter;
