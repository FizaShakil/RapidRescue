import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Ambulance } from "../models/ambulance.model.js";
import mongoose from "mongoose";

const VEHICLE_TYPES = ["BLS", "ALS", "ICU"];

// POST /api/v1/admin/ambulances/add-ambulance
const createAmbulance = asyncHandler(async (req, res) => {
    const { registrationNumber, vehicleType, lastServiceDate, notes } = req.body;

    if (!registrationNumber || !vehicleType) {
        throw new ApiError(400, "registrationNumber and vehicleType are required");
    }

    if (!VEHICLE_TYPES.includes(vehicleType)) {
        throw new ApiError(
            400,
            `vehicleType must be one of: ${VEHICLE_TYPES.join(", ")}`
        );
    }

    // Use exists() so we don't load an entire document just to check for a duplicate.
    const exists = await Ambulance.exists({
        registrationNumber: registrationNumber.toUpperCase(),
    });
    if (exists) {
        throw new ApiError(409, "An ambulance with this registration number already exists");
    }

    const ambulance = await Ambulance.create({
        registrationNumber,
        vehicleType,
        lastServiceDate: lastServiceDate || undefined,
        notes: notes || undefined,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, ambulance, "Ambulance added successfully"));
});

// GET /api/v1/admin/ambulances/get-all-ambulances
const getAllAmbulances = asyncHandler(async (req, res) => {
    const { available, type, page = 1, limit = 20 } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const filter = {};

    if (available !== undefined) {
        filter.isAvailable = available === "true";
    }

    if (type) {
        if (!VEHICLE_TYPES.includes(type)) {
            throw new ApiError(400, `type must be one of: ${VEHICLE_TYPES.join(", ")}`);
        }
        filter.vehicleType = type;
    }

    const [total, ambulances] = await Promise.all([
        Ambulance.countDocuments(filter),
        Ambulance.find(filter)
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
                ambulances,
                pagination: {
                    total,
                    page: pageNum,
                    limit: limitNum,
                    totalPages: Math.ceil(total / limitNum),
                },
            },
            "Ambulances fetched successfully"
        )
    );
});

// GET /api/v1/admin/ambulances/available-ambulances
// No pagination here because the fleet is small and this is used to populate
// the dispatch dropdown which needs all options at once.
const getAvailableAmbulances = asyncHandler(async (_req, res) => {
    const ambulances = await Ambulance.find({ isAvailable: true })
        .select("registrationNumber vehicleType currentLocation")
        .lean();

    return res
        .status(200)
        .json(new ApiResponse(200, ambulances, "Available ambulances fetched successfully"));
});

// GET /api/v1/admin/ambulances/get-ambulance-data/:id
const getAmbulanceById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, "Invalid ambulance ID");
    }

    const ambulance = await Ambulance.findById(id)
        .populate({
            path: "assignedDriver",
            select: "licenseNumber status certifications",
            populate: { path: "user", select: "fullName phone email" },
        })
        .populate("assignedBooking", "status bookingType patientName createdAt")
        .lean();

    if (!ambulance) {
        throw new ApiError(404, "Ambulance not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, ambulance, "Ambulance fetched successfully"));
});

// PATCH /api/v1/admin/ambulances/update-ambulance-data/:id
// Only allows updating general info. Availability and assignment
// are managed by the dispatch flow and cannot be changed here.
const updateAmbulance = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { vehicleType, lastServiceDate, notes } = req.body;

    if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, "Invalid ambulance ID");
    }

    if (vehicleType && !VEHICLE_TYPES.includes(vehicleType)) {
        throw new ApiError(
            400,
            `vehicleType must be one of: ${VEHICLE_TYPES.join(", ")}`
        );
    }

    const updateFields = {};
    if (vehicleType) updateFields.vehicleType = vehicleType;
    if (lastServiceDate !== undefined) updateFields.lastServiceDate = lastServiceDate;
    if (notes !== undefined) updateFields.notes = notes;

    if (Object.keys(updateFields).length === 0) {
        throw new ApiError(400, "Provide at least one field to update");
    }

    const ambulance = await Ambulance.findByIdAndUpdate(
        id,
        { $set: updateFields },
        { new: true, runValidators: true }
    );

    if (!ambulance) {
        throw new ApiError(404, "Ambulance not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, ambulance, "Ambulance updated successfully"));
});

// DELETE /api/v1/admin/ambulances/delete-ambulance/:id
// Blocks deletion if the ambulance is currently out on a job.
const deleteAmbulance = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, "Invalid ambulance ID");
    }

    const ambulance = await Ambulance.findById(id).select(
        "isAvailable assignedBooking registrationNumber"
    );
    if (!ambulance) {
        throw new ApiError(404, "Ambulance not found");
    }

    if (!ambulance.isAvailable || ambulance.assignedBooking) {
        throw new ApiError(
            400,
            "Cannot delete an ambulance that is currently assigned to an active booking"
        );
    }

    await Ambulance.findByIdAndDelete(id);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Ambulance deleted successfully"));
});

export {
    createAmbulance,
    getAllAmbulances,
    getAvailableAmbulances,
    getAmbulanceById,
    updateAmbulance,
    deleteAmbulance,
};
