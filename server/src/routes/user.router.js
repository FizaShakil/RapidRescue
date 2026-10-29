import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    accessRefreshToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
} from "../controllers/user.controller.js";
import {
    createBooking,
    getMyBookings,
    getMyBookingById,
    cancelMyBooking,
} from "../controllers/booking.controller.js";
import {
    createMedicalProfile,
    getMyMedicalProfile,
    updateMyMedicalProfile,
} from "../controllers/medicalProfile.controller.js";
import {
    submitFeedback,
    getMyFeedback,
} from "../controllers/feedback.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router();

// ── Public routes ─────────────────────────────────────────────────────────────
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/refresh-token", accessRefreshToken);

// ── Authenticated routes ──────────────────────────────────────────────────────
userRouter.use(verifyJWT);

userRouter.post("/logout", logoutUser);
userRouter.post("/change-password", changeCurrentPassword);
userRouter.get("/my-profile", getCurrentUser);
userRouter.patch("/update-profile", updateAccountDetails);

// Bookings
userRouter.post("/create-booking", createBooking);
userRouter.get("/my-bookings", getMyBookings);
userRouter.get("/my-bookings/:id", getMyBookingById);
userRouter.patch("/cancel-booking/:id", cancelMyBooking);

// Medical profile
userRouter.post("/create-medical-profile", createMedicalProfile);
userRouter.get("/my-medical-profile", getMyMedicalProfile);
userRouter.patch("/update-medical-profile", updateMyMedicalProfile);

// Feedback
userRouter.post("/submit-feedback", submitFeedback);
userRouter.get("/my-feedback", getMyFeedback);

export default userRouter;
