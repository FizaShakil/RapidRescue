import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Driver } from "../models/driver.model.js";
import { Booking } from "../models/booking.model.js";
import { Ambulance } from "../models/ambulance.model.js";
import { MedicalProfile } from "../models/medicalprofile.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

// The driver can only move a booking forward one step at a time.
// They cannot confirm, cancel, or jump ahead.

const DRIVER_ALLOWED_TRANSITIONS = {
    confirmed: "en_route",
    en_route: "arrived",
    arrived: "transporting",
    transporting: "completed",
};

// Looks up the Driver document for the logged-in user.
// Called at the top of every driver-facing function so we always
// use the real driver ID from the database, not anything from the request.

const resolveDriverProfile = async (userId) => {
    const driver = await Driver.findOne({ user: userId }).select(
        "_id isAvailable status assignedAmbulance licenseNumber certifications currentLocation"
    );
    if (!driver) {
        throw new ApiError(404, "Driver profile not found for this account");
    }
    return driver;
};


// POST /api/v1/admin/drivers/create-driver-profile
// The user account must already exist and have role "driver" before calling this.
const createDriverProfile = asyncHandler(async (req, res) => {
    const { userId, licenseNumber, certifications } = req.body;

    if (!userId || !licenseNumber) {
        throw new ApiError(400, "userId and licenseNumber are required");
    }
    if (!mongoose.isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid userId");
    }

    const user = await User.findById(userId).select("role fullName").lean();
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    if (user.role !== "driver") {
        throw new ApiError(
            400,
            "The user's role must be 'driver'. Update the user's role first."
        );
    }

    const existingProfile = await Driver.exists({ user: userId });
    if (existingProfile) {
        throw new ApiError(409, "A driver profile already exists for this user");
    }
    const duplicateLicense = await Driver.exists({ licenseNumber });
    if (duplicateLicense) {
        throw new ApiError(409, "A driver with this license number already exists");
    }

    const driver = await Driver.create({
        user: userId,
        licenseNumber,
        certifications: certifications || [],
    });

    await driver.populate("user", "fullName phone email username");

    return res
        .status(201)
        .json(new ApiResponse(201, driver, "Driver profile created successfully"));
});

// GET /api/v1/admin/drivers/all-drivers
const getAllDrivers = asyncHandler(async (req, res) => {
    const { available, page = 1, limit = 20 } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const filter = {};
    if (available !== undefined) {
        filter.isAvailable = available === "true";
    }

    const [total, drivers] = await Promise.all([
        Driver.countDocuments(filter),
        Driver.find(filter)
            .populate("user", "fullName phone email username")
            .populate("assignedAmbulance", "registrationNumber vehicleType")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum)
            .lean(),
    ]);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                drivers,
                pagination: {
                    total,
                    page: pageNum,
                    limit: limitNum,
                    totalPages: Math.ceil(total / limitNum),
                },
            },
            "Drivers fetched successfully"
        )
    );
});

// GET /api/v1/admin/drivers/available-drivers
// No pagination — fleet is small and the dispatch form needs the full list.
const getAvailableDrivers = asyncHandler(async (_req, res) => {
    const drivers = await Driver.find({ isAvailable: true, status: "on_duty" })
        .select("licenseNumber certifications currentLocation")
        .populate("user", "fullName phone")
        .lean();

    return res
        .status(200)
        .json(new ApiResponse(200, drivers, "Available drivers fetched successfully"));
});

// GET /api/v1/admin/drivers/get-driver/:id
const getDriverById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, "Invalid driver ID");
    }

    const driver = await Driver.findById(id)
        .populate("user", "fullName phone email username createdAt")
        .populate("assignedAmbulance", "registrationNumber vehicleType currentLocation")
        .lean();

    if (!driver) {
        throw new ApiError(404, "Driver not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, driver, "Driver fetched successfully"));
});

// PATCH /api/v1/admin/drivers/update-driver/:id
// Admin can update license, certifications, and on_duty/off_duty status.
// Availability and ambulance assignment are managed by the dispatch flow only.

const updateDriver = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { licenseNumber, certifications, status } = req.body;

    if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, "Invalid driver ID");
    }

    const adminSettableStatuses = ["on_duty", "off_duty"];
    if (status && !adminSettableStatuses.includes(status)) {
        throw new ApiError(
            400,
            `Admin can only set status to: ${adminSettableStatuses.join(", ")}. en_route and busy are set by the system.`
        );
    }

    const updateFields = {};
    if (licenseNumber) updateFields.licenseNumber = licenseNumber;
    if (certifications !== undefined) updateFields.certifications = certifications;
    if (status) updateFields.status = status;

    if (Object.keys(updateFields).length === 0) {
        throw new ApiError(400, "Provide at least one field to update");
    }

    const driver = await Driver.findByIdAndUpdate(
        id,
        { $set: updateFields },
        { new: true, runValidators: true }
    ).populate("user", "fullName phone email");

    if (!driver) {
        throw new ApiError(404, "Driver not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, driver, "Driver updated successfully"));
});


// GET /api/v1/driver/my-profile
const getMyDriverProfile = asyncHandler(async (req, res) => {
    const driver = await Driver.findOne({ user: req.user._id })
        .populate("user", "fullName phone email username")
        .populate("assignedAmbulance", "registrationNumber vehicleType currentLocation")
        .lean();

    if (!driver) {
        throw new ApiError(404, "Driver profile not found for this account");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, driver, "Driver profile fetched successfully"));
});

// GET /api/v1/driver/my-assigned-bookings
// Only returns bookings assigned to the currently logged-in driver.
const getMyAssignedBookings = asyncHandler(async (req, res) => {
    const { status, page = 1, limit = 10 } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const driver = await resolveDriverProfile(req.user._id);

    const filter = { assignedDriver: driver._id };

    if (status) {
        const driverVisibleStatuses = Object.keys(DRIVER_ALLOWED_TRANSITIONS).concat(
            ["completed", "cancelled"]
        );
        if (!driverVisibleStatuses.includes(status)) {
            throw new ApiError(
                400,
                `Invalid status. Driver-visible statuses: ${driverVisibleStatuses.join(", ")}`
            );
        }
        filter.status = status;
    }

    const [total, bookings] = await Promise.all([
        Booking.countDocuments(filter),
        Booking.find(filter)
            .select("-medicalProfile") // medical data is only accessible through its own endpoint
            .populate("user", "fullName phone")
            .populate("assignedAmbulance", "registrationNumber vehicleType")
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
            "Assigned bookings fetched successfully"
        )
    );
});

// GET /api/v1/driver/my-assigned-bookings/:id
// The assignedDriver filter prevents a driver from reading someone else's booking.
const getAssignedBookingById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, "Invalid booking ID");
    }

    const driver = await resolveDriverProfile(req.user._id);

    const booking = await Booking.findOne({ _id: id, assignedDriver: driver._id })
        .populate("user", "fullName phone")
        .populate("assignedAmbulance", "registrationNumber vehicleType currentLocation")
        .lean();

    if (!booking) {
        throw new ApiError(404, "Booking not found or not assigned to you");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, booking, "Booking fetched successfully"));
});

// GET /api/v1/driver/my-assigned-bookings/:id/patient-medical-profile
// Only works if the booking is active and assigned to this driver.
// We only return the fields a driver actually needs on the job.
const getPatientMedicalProfile = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, "Invalid booking ID");
    }

    const driver = await resolveDriverProfile(req.user._id);

    const activeStatuses = ["confirmed", "en_route", "arrived", "transporting"];

    const booking = await Booking.findOne({
        _id: id,
        assignedDriver: driver._id,
        status: { $in: activeStatuses },
    })
        .select("medicalProfile patientName")
        .lean();

    if (!booking) {
        throw new ApiError(
            404,
            "Booking not found, not assigned to you, or not in an active state"
        );
    }

    if (!booking.medicalProfile) {
        throw new ApiError(404, "No medical profile linked to this booking");
    }

    const profile = await MedicalProfile.findById(booking.medicalProfile)
        .select(
            "bloodGroup allergies chronicConditions currentMedications emergencyContacts notes"
        )
        .lean();

    if (!profile) {
        throw new ApiError(404, "Medical profile not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            { patientName: booking.patientName, medicalProfile: profile },
            "Patient medical profile fetched successfully"
        )
    );
});

// PATCH /api/v1/driver/my-assigned-bookings/:id/update-status
// Moves the booking to the next allowed status.
// On completion, the ambulance and driver are both released back to available.

const updateBookingStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status: newStatus } = req.body;

    if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, "Invalid booking ID");
    }
    if (!newStatus) {
        throw new ApiError(400, "status is required");
    }

    const driver = await resolveDriverProfile(req.user._id);

    const booking = await Booking.findOne({
        _id: id,
        assignedDriver: driver._id,
    }).select("status assignedAmbulance assignedDriver");

    if (!booking) {
        throw new ApiError(404, "Booking not found or not assigned to you");
    }

    const allowedNext = DRIVER_ALLOWED_TRANSITIONS[booking.status];
    if (!allowedNext) {
        throw new ApiError(
            400,
            `Booking is in a terminal state '${booking.status}' and cannot be updated`
        );
    }
    if (newStatus !== allowedNext) {
        throw new ApiError(
            400,
            `Invalid transition: '${booking.status}' to '${newStatus}'. Expected: '${allowedNext}'`
        );
    }

    // Maps the booking status to what the driver's own status should be at that point.
    const driverStatusMap = {
        en_route: "en_route",
        arrived: "busy",
        transporting: "busy",
    };

    booking.status = newStatus;
    if (newStatus === "completed") {
        booking.completedAt = new Date();
    }
    await booking.save();

    if (newStatus === "completed") {
        // Release both resources in parallel since they don't depend on each other.
        await Promise.all([
            Ambulance.findByIdAndUpdate(booking.assignedAmbulance, {
                isAvailable: true,
                assignedDriver: null,
                assignedBooking: null,
            }),
            Driver.findByIdAndUpdate(driver._id, {
                isAvailable: true,
                status: "on_duty",
                assignedAmbulance: null,
            }),
        ]);
    } 
    else {
        await Driver.findByIdAndUpdate(driver._id, {
            status: driverStatusMap[newStatus],
        });
    }

    return res
        .status(200)
        .json(new ApiResponse(200, booking, `Booking status updated to '${newStatus}'`));
});

// PATCH /api/v1/driver/my-assigned-bookings/:id/add-notes
const updateDriverNotes = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { driverNotes } = req.body;

    if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, "Invalid booking ID");
    }
    if (!driverNotes || driverNotes.trim() === "") {
        throw new ApiError(400, "driverNotes is required");
    }

    const driver = await resolveDriverProfile(req.user._id);

    // Single update with an ownership filter — no need for a separate read first.
    const booking = await Booking.findOneAndUpdate(
        { _id: id, assignedDriver: driver._id },
        { $set: { driverNotes: driverNotes.trim() } },
        { new: true }
    ).select("_id status driverNotes");

    if (!booking) {
        throw new ApiError(404, "Booking not found or not assigned to you");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, booking, "Driver notes updated successfully"));
});

// PATCH /api/v1/driver/update-my-location
// Location is always saved for the driver resolved from the token,
// never for an ID that comes from the request body.
const updateMyLocation = asyncHandler(async (req, res) => {
    const { lat, lng } = req.body;

    if (lat === undefined || lng === undefined) {
        throw new ApiError(400, "lat and lng are required");
    }

    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);

    if (
        isNaN(parsedLat) || isNaN(parsedLng) ||
        parsedLat < -90 || parsedLat > 90 ||
        parsedLng < -180 || parsedLng > 180
    ) {
        throw new ApiError(
            400,
            "Invalid coordinates. lat must be -90 to 90, lng must be -180 to 180"
        );
    }

    const driver = await resolveDriverProfile(req.user._id);

    await Driver.findByIdAndUpdate(driver._id, {
        $set: { currentLocation: { lat: parsedLat, lng: parsedLng } },
    });

    return res
        .status(200)
        .json(new ApiResponse(200, { lat: parsedLat, lng: parsedLng }, "Location updated successfully"));
});

// PATCH /api/v1/driver/update-my-status
// Drivers can only set themselves on_duty or off_duty.
// en_route and busy are set automatically by the booking flow.

const updateMyStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;

    const selfSettableStatuses = ["on_duty", "off_duty"];
    if (!status || !selfSettableStatuses.includes(status)) {
        throw new ApiError(
            400,
            `status must be one of: ${selfSettableStatuses.join(", ")}`
        );
    }

    const driver = await resolveDriverProfile(req.user._id);

    if (status === "off_duty" && !driver.isAvailable) {
        throw new ApiError(
            400,
            "Cannot go off duty while assigned to an active booking"
        );
    }

    await Driver.findByIdAndUpdate(driver._id, { $set: { status } });

    return res
        .status(200)
        .json(new ApiResponse(200, { status }, `Status updated to '${status}'`));
});

// GET /api/v1/driver/my-current-assignment
// Returns everything a driver needs for their dashboard in one call.
// If the driver is available there is no active assignment, so we skip the booking query.

const getCurrentAssignment = asyncHandler(async (req, res) => {
    const driver = await Driver.findOne({ user: req.user._id })
        .select("isAvailable status assignedAmbulance currentLocation")
        .populate("assignedAmbulance", "registrationNumber vehicleType currentLocation")
        .lean();

    if (!driver) {
        throw new ApiError(404, "Driver profile not found");
    }

    if (driver.isAvailable) {
        return res
            .status(200)
            .json(new ApiResponse(200, { assignment: null }, "No active assignment"));
    }

    const activeStatuses = ["confirmed", "en_route", "arrived", "transporting"];

    const booking = await Booking.findOne({
        assignedDriver: driver._id,
        status: { $in: activeStatuses },
    })
        .select(
            "bookingType status pickupLocation dropLocation patientName patientPhone emergencyDescription scheduledAt driverNotes assignedAmbulance"
        )
        .lean();

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                driverStatus: driver.status,
                currentLocation: driver.currentLocation,
                assignedAmbulance: driver.assignedAmbulance,
                assignment: booking || null,
            },
            "Current assignment fetched successfully"
        )
    );
});

export {
    createDriverProfile,
    getAllDrivers,
    getAvailableDrivers,
    getDriverById,
    updateDriver,
    getMyDriverProfile,
    getMyAssignedBookings,
    getAssignedBookingById,
    getPatientMedicalProfile,
    updateBookingStatus,
    updateDriverNotes,
    updateMyLocation,
    updateMyStatus,
    getCurrentAssignment,
};
