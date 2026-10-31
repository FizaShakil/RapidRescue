import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Booking } from "../models/booking.model.js";
import { Ambulance } from "../models/ambulance.model.js";
import { Driver } from "../models/driver.model.js";
import { MedicalProfile } from "../models/medicalprofile.model.js";
import mongoose from "mongoose";

// Defines which status can move to which next status.
// Anything not listed here is a terminal state or an invalid jump.
const ALLOWED_TRANSITIONS = {
    pending: ["confirmed", "cancelled"],
    confirmed: ["en_route", "cancelled"],
    en_route: ["arrived"],
    arrived: ["transporting"],
    transporting: ["completed"],
    completed: [],
    cancelled: [],
};

const isValidTransition = (current, next) =>
    ALLOWED_TRANSITIONS[current]?.includes(next) ?? false;


// POST /api/v1/users/create-booking
const createBooking = asyncHandler(async (req, res) => {
    const {
        bookingType,
        pickupLocation,
        dropLocation,
        patientName,
        patientPhone,
        emergencyDescription,
        scheduledAt,
    } = req.body;

    if (!bookingType || !pickupLocation?.address || !patientName || !patientPhone) {
        throw new ApiError(
            400,
            "bookingType, pickupLocation.address, patientName and patientPhone are required"
        );
    }

    if (!["emergency", "non_emergency"].includes(bookingType)) {
        throw new ApiError(400, "bookingType must be 'emergency' or 'non_emergency'");
    }

    if (bookingType === "non_emergency" && !scheduledAt) {
        throw new ApiError(400, "scheduledAt is required for non-emergency bookings");
    }

    // Link the user's medical profile if they have one. Not an error if they don't.
    const medicalProfile = await MedicalProfile.findOne({ user: req.user._id })
        .select("_id")
        .lean();

    const booking = await Booking.create({
        user: req.user._id, // always taken from the token, never from the request body
        bookingType,
        pickupLocation,
        dropLocation: dropLocation || undefined,
        patientName,
        patientPhone,
        emergencyDescription: emergencyDescription || undefined,
        scheduledAt: scheduledAt || undefined,
        medicalProfile: medicalProfile?._id || null,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, booking, "Booking created successfully"));
});

// GET /api/v1/users/my-bookings
const getMyBookings = asyncHandler(async (req, res) => {
    const { status, page = 1, limit = 10 } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    // Always filter by the logged-in user. Never trust a userId from the query string.
    const filter = { user: req.user._id };

    if (status) {
        if (!Object.keys(ALLOWED_TRANSITIONS).includes(status)) {
            throw new ApiError(400, `Invalid status value: ${status}`);
        }
        filter.status = status;
    }

    // Run the count and the data fetch at the same time to save a round trip.
    const [total, bookings] = await Promise.all([
        Booking.countDocuments(filter),
        Booking.find(filter)
            .select("-driverNotes -medicalProfile")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum)
            .lean(),
    ]);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                bookings,
                pagination: {
                    total,
                    page: pageNum,
                    limit: limitNum,
                    totalPages: Math.ceil(total / limitNum),
                },
            },
            "Bookings fetched successfully"
        )
    );
});

// GET /api/v1/users/my-bookings/:id
const getMyBookingById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, "Invalid booking ID");
    }

    // The user field in the query ensures a user can only see their own bookings.
    const booking = await Booking.findOne({ _id: id, user: req.user._id })
        .populate("assignedAmbulance", "registrationNumber vehicleType currentLocation")
        .populate({
            path: "assignedDriver",
            select: "licenseNumber status currentLocation",
            populate: { path: "user", select: "fullName phone" },
        })
        .lean();

    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, booking, "Booking fetched successfully"));
});

// PATCH /api/v1/users/cancel-booking/:id
const cancelMyBooking = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { cancelReason } = req.body;

    if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, "Invalid booking ID");
    }

    // Include the user filter so users can only cancel their own bookings.
    const booking = await Booking.findOne({ _id: id, user: req.user._id });
    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    // Users can only cancel before the admin has acted on the booking.
    if (booking.status !== "pending") {
        throw new ApiError(
            400,
            `You can only cancel a pending booking. Current status: ${booking.status}`
        );
    }

    booking.status = "cancelled";
    booking.cancelledAt = new Date();
    if (cancelReason) booking.cancelReason = cancelReason;
    await booking.save();

    return res
        .status(200)
        .json(new ApiResponse(200, booking, "Booking cancelled successfully"));
});


// GET /api/v1/admin/bookings/all-bookings
const getAllBookings = asyncHandler(async (req, res) => {
    const { status, type, page = 1, limit = 20 } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const filter = {};

    if (status) {
        if (!Object.keys(ALLOWED_TRANSITIONS).includes(status)) {
            throw new ApiError(400, `Invalid status. Must be one of: ${Object.keys(ALLOWED_TRANSITIONS).join(", ")}`);
        }
        filter.status = status;
    }

    if (type) {
        if (!["emergency", "non_emergency"].includes(type)) {
            throw new ApiError(400, "type must be 'emergency' or 'non_emergency'");
        }
        filter.bookingType = type;
    }

    const [total, bookings] = await Promise.all([
        Booking.countDocuments(filter),
        Booking.find(filter)
            .select("-driverNotes -medicalProfile")
            .populate("user", "fullName phone email")
            .populate("assignedAmbulance", "registrationNumber vehicleType")
            .populate({
                path: "assignedDriver",
                select: "licenseNumber",
                populate: { path: "user", select: "fullName phone" },
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum)
            .lean(),
    ]);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                bookings,
                pagination: {
                    total,
                    page: pageNum,
                    limit: limitNum,
                    totalPages: Math.ceil(total / limitNum),
                },
            },
            "Bookings fetched successfully"
        )
    );
});

// GET /api/v1/admin/bookings/get-booking/:id
// Admin gets full detail including medical profile.
const getBookingById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, "Invalid booking ID");
    }

    const booking = await Booking.findById(id)
        .populate("user", "fullName phone email username")
        .populate("assignedAmbulance", "registrationNumber vehicleType currentLocation notes")
        .populate({
            path: "assignedDriver",
            select: "licenseNumber certifications status currentLocation",
            populate: { path: "user", select: "fullName phone email" },
        })
        .populate("medicalProfile")
        .lean();

    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, booking, "Booking fetched successfully"));
});

// PATCH /api/v1/admin/bookings/confirm-booking/:id
const confirmBooking = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, "Invalid booking ID");
    }

    const booking = await Booking.findById(id);
    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    if (!isValidTransition(booking.status, "confirmed")) {
        throw new ApiError(400, `Cannot confirm a booking with status '${booking.status}'`);
    }

    booking.status = "confirmed";
    await booking.save();

    return res
        .status(200)
        .json(new ApiResponse(200, booking, "Booking confirmed"));
});

// PATCH /api/v1/admin/bookings/cancel-booking/:id
const adminCancelBooking = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { cancelReason } = req.body;

    if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, "Invalid booking ID");
    }

    const booking = await Booking.findById(id);
    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    if (!isValidTransition(booking.status, "cancelled")) {
        throw new ApiError(400, `Cannot cancel a booking with status '${booking.status}'`);
    }

    // If resources were already assigned, release them back to the pool.
    if (booking.assignedAmbulance) {
        await Ambulance.findByIdAndUpdate(booking.assignedAmbulance, {
            isAvailable: true,
            assignedDriver: null,
            assignedBooking: null,
        });
    }
    if (booking.assignedDriver) {
        await Driver.findByIdAndUpdate(booking.assignedDriver, {
            isAvailable: true,
            assignedAmbulance: null,
        });
    }

    booking.status = "cancelled";
    booking.cancelledAt = new Date();
    if (cancelReason) booking.cancelReason = cancelReason;
    await booking.save();

    return res
        .status(200)
        .json(new ApiResponse(200, booking, "Booking cancelled"));
});

// PATCH /api/v1/admin/bookings/assign-booking/:id
// Claims the ambulance and driver atomically to prevent double-assignment.
// If the driver claim fails, the ambulance claim is rolled back.
const assignBooking = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { ambulanceId, driverId } = req.body;

    if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, "Invalid booking ID");
    }
    if (!ambulanceId || !mongoose.isValidObjectId(ambulanceId)) {
        throw new ApiError(400, "Valid ambulanceId is required");
    }
    if (!driverId || !mongoose.isValidObjectId(driverId)) {
        throw new ApiError(400, "Valid driverId is required");
    }

    const booking = await Booking.findById(id);
    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    if (!["pending", "confirmed"].includes(booking.status)) {
        throw new ApiError(400, `Cannot assign resources to a booking with status '${booking.status}'`);
    }

    // Including isAvailable: true in the filter makes this claim atomic.
    // If another request already took the ambulance, this returns null.
    const ambulance = await Ambulance.findOneAndUpdate(
        { _id: ambulanceId, isAvailable: true },
        { isAvailable: false, assignedDriver: driverId, assignedBooking: id },
        { new: true }
    );

    if (!ambulance) {
        throw new ApiError(409, "Ambulance is not available or does not exist");
    }

    const driver = await Driver.findOneAndUpdate(
        { _id: driverId, isAvailable: true, status: "on_duty" },
        { isAvailable: false, assignedAmbulance: ambulanceId },
        { new: true }
    );

    if (!driver) {
        // Driver was not available so undo the ambulance claim.
        await Ambulance.findByIdAndUpdate(ambulanceId, {
            isAvailable: true,
            assignedDriver: null,
            assignedBooking: null,
        });
        throw new ApiError(409, "Driver is not available or not on duty. Ambulance assignment rolled back.");
    }

    booking.assignedAmbulance = ambulanceId;
    booking.assignedDriver = driverId;
    booking.status = "confirmed";
    await booking.save();

    // Populate inline so we don't need to fetch the booking a second time.
    await booking.populate("assignedAmbulance", "registrationNumber vehicleType");
    await booking.populate({
        path: "assignedDriver",
        select: "licenseNumber",
        populate: { path: "user", select: "fullName phone" },
    });

    return res
        .status(200)
        .json(new ApiResponse(200, booking, "Booking assigned successfully"));
});

// GET /api/v1/admin/bookings/dashboard-stats
// Uses aggregation to count all booking statuses in one DB query.
const getDashboardStats = asyncHandler(async (req, res) => {
    const [bookingStats, availableAmbulances, availableDrivers] =
        await Promise.all([
            Booking.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
            Ambulance.countDocuments({ isAvailable: true }),
            Driver.countDocuments({ isAvailable: true, status: "on_duty" }),
        ]);

    const statusCounts = bookingStats.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
    }, {});

    const stats = {
        bookings: {
            pending: statusCounts.pending || 0,
            confirmed: statusCounts.confirmed || 0,
            en_route: statusCounts.en_route || 0,
            arrived: statusCounts.arrived || 0,
            transporting: statusCounts.transporting || 0,
            completed: statusCounts.completed || 0,
            cancelled: statusCounts.cancelled || 0,
            total: Object.values(statusCounts).reduce((a, b) => a + b, 0),
        },
        fleet: {
            availableAmbulances,
            availableDrivers,
        },
    };

    return res
        .status(200)
        .json(new ApiResponse(200, stats, "Dashboard stats fetched successfully"));
});

export {
    createBooking,
    getMyBookings,
    getMyBookingById,
    cancelMyBooking,
    getAllBookings,
    getBookingById,
    confirmBooking,
    adminCancelBooking,
    assignBooking,
    getDashboardStats,
};
