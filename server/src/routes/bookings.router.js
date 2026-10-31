import { Router } from "express";
import {
    getAllBookings,
    getBookingById,
    confirmBooking,
    adminCancelBooking,
    assignBooking,
    getDashboardStats,
} from "../controllers/booking.controller.js";
import { verifyJWT, verifyRole } from "../middlewares/auth.middleware.js";

const bookingRouter = Router();

bookingRouter.use(verifyJWT, verifyRole("admin"));

bookingRouter.get("/dashboard-stats", getDashboardStats);
bookingRouter.get("/all-bookings", getAllBookings);
bookingRouter.get("/get-booking/:id", getBookingById);
bookingRouter.patch("/confirm-booking/:id", confirmBooking);
bookingRouter.patch("/cancel-booking/:id", adminCancelBooking);
bookingRouter.patch("/assign-booking/:id", assignBooking);

export default bookingRouter;
