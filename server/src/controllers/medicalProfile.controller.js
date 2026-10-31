import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { MedicalProfile } from "../models/medicalprofile.model.js";
import mongoose from "mongoose";

// POST /api/v1/users/create-medical-profile
const createMedicalProfile = asyncHandler(async (req, res) => {
    // Only one profile per user is allowed.
    const existing = await MedicalProfile.exists({ user: req.user._id });
    if (existing) {
        throw new ApiError(409, "Medical profile already exists. Use PATCH to update it.");
    }

    const {
        bloodGroup,
        allergies,
        chronicConditions,
        currentMedications,
        emergencyContacts,
        notes,
    } = req.body;

    // The user field always comes from the token, not from the request body.
    const profile = await MedicalProfile.create({
        user: req.user._id,
        bloodGroup,
        allergies,
        chronicConditions,
        currentMedications,
        emergencyContacts,
        notes,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, profile, "Medical profile created successfully"));
});

// GET /api/v1/users/my-medical-profile
const getMyMedicalProfile = asyncHandler(async (req, res) => {
    const profile = await MedicalProfile.findOne({ user: req.user._id }).lean();

    if (!profile) {
        throw new ApiError(404, "Medical profile not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, profile, "Medical profile fetched successfully"));
});

// PATCH /api/v1/users/update-medical-profile
const updateMyMedicalProfile = asyncHandler(async (req, res) => {
    const {
        bloodGroup,
        allergies,
        chronicConditions,
        currentMedications,
        emergencyContacts,
        notes,
    } = req.body;

    // Build the update from only the fields that were sent.
    const updateFields = {};
    if (bloodGroup !== undefined) updateFields.bloodGroup = bloodGroup;
    if (allergies !== undefined) updateFields.allergies = allergies;
    if (chronicConditions !== undefined) updateFields.chronicConditions = chronicConditions;
    if (currentMedications !== undefined) updateFields.currentMedications = currentMedications;
    if (emergencyContacts !== undefined) updateFields.emergencyContacts = emergencyContacts;
    if (notes !== undefined) updateFields.notes = notes;

    if (Object.keys(updateFields).length === 0) {
        throw new ApiError(400, "Provide at least one field to update");
    }

    // The user filter means a person can only update their own profile.
    const profile = await MedicalProfile.findOneAndUpdate(
        { user: req.user._id },
        { $set: updateFields },
        { new: true, runValidators: true }
    );

    if (!profile) {
        throw new ApiError(404, "Medical profile not found. Create one first.");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, profile, "Medical profile updated successfully"));
});

// GET /api/v1/admin/medical-profiles/get-user-medical-profile/:userId
const getMedicalProfileByUserId = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID");
    }

    const profile = await MedicalProfile.findOne({ user: userId })
        .populate("user", "fullName phone email")
        .lean();

    if (!profile) {
        throw new ApiError(404, "Medical profile not found for this user");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, profile, "Medical profile fetched successfully"));
});

export {
    createMedicalProfile,
    getMyMedicalProfile,
    updateMyMedicalProfile,
    getMedicalProfileByUserId,
};
