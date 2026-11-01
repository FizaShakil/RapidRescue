import { Router } from "express";
import {
    // Admin-facing
    createDriverProfile,
    getAllDrivers,
    getAvailableDrivers,
    getDriverById,
    updateDriver,
    // Driver-facing
    getMyDriverProfile,
    getMyAssignedBookings,
    getAssignedBookingById,
    getPatientMedicalProfile,
    updateBookingStatus,
    updateDriverNotes,
    updateMyLocation,
    updateMyStatus,
    getCurrentAssignment,
} from "../controllers/driver.controller.js";
import { verifyJWT, verifyRole } from "../middlewares/auth.middleware.js";

// ── Admin routes (/api/v1/admin/drivers) ─────────────────────────────────────
const adminDriverRouter = Router();

adminDriverRouter.use(verifyJWT, verifyRole("admin"));

adminDriverRouter.get("/available-drivers", getAvailableDrivers);
adminDriverRouter.get("/all-drivers", getAllDrivers);
adminDriverRouter.post("/create-driver-profile", createDriverProfile);
adminDriverRouter.get("/get-driver/:id", getDriverById);
adminDriverRouter.patch("/update-driver/:id", updateDriver);

// ── Driver self-service routes (/api/v1/driver) ───────────────────────────────
const driverRouter = Router();

driverRouter.use(verifyJWT, verifyRole("driver"));

driverRouter.get("/my-profile", getMyDriverProfile);
driverRouter.get("/my-current-assignment", getCurrentAssignment);
driverRouter.patch("/update-my-location", updateMyLocation);
driverRouter.patch("/update-my-status", updateMyStatus);

driverRouter.get("/my-assigned-bookings", getMyAssignedBookings);
driverRouter.get("/my-assigned-bookings/:id", getAssignedBookingById);
driverRouter.patch("/my-assigned-bookings/:id/update-status", updateBookingStatus);
driverRouter.patch("/my-assigned-bookings/:id/add-notes", updateDriverNotes);
driverRouter.get("/my-assigned-bookings/:id/patient-medical-profile", getPatientMedicalProfile);

export { adminDriverRouter, driverRouter };
