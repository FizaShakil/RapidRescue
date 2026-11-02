import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Feedback } from "../models/feedback.model.js";
import { Booking } from "../models/booking.model.js";
import mongoose from "mongoose";

// POST /api/v1/users/submit-feedback
const submitFeedback = asyncHandler(async (req, res) => {
    const { bookingId, rating, comment } = req.body;

    if (!bookingId || rating === undefined) {
        throw new ApiError(400, "bookingId and rating are required");
    }

    if (!mongoose.isValidObjectId(bookingId)) {
        throw new ApiError(400, "Invalid booking ID");
    }

    const ratingNum = Number(rating);
    if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
        throw new ApiError(400, "Rating must be a whole number between 1 and 5");
    }

    // Check in one query that the booking exists, is completed, and belongs to this user.
    const booking = await Booking.findOne({
        _id: bookingId,
        user: req.user._id,
        status: "completed",
    })
        .select("_id")
        .lean();

    if (!booking) {
        throw new ApiError(404, "Booking not found, not completed, or does not belong to you");
    }

    const alreadyReviewed = await Feedback.exists({ booking: bookingId });
    if (alreadyReviewed) {
        throw new ApiError(409, "Feedback for this booking has already been submitted");
    }

    const feedback = await Feedback.create({
        user: req.user._id,
        booking: bookingId,
        rating: ratingNum,
        comment: comment?.trim() || undefined,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, feedback, "Feedback submitted successfully"));
});

// GET /api/v1/users/my-feedback
const getMyFeedback = asyncHandler(async (req, res) => {
    const feedback = await Feedback.find({ user: req.user._id })
        .populate("booking", "bookingType status createdAt")
        .sort({ createdAt: -1 })
        .lean();

    return res
        .status(200)
        .json(new ApiResponse(200, feedback, "Feedback fetched successfully"));
});

// GET /api/v1/admin/feedback/all-feedback
const getAllFeedback = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20 } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [total, feedback] = await Promise.all([
        Feedback.countDocuments(),
        Feedback.find()
            .populate("user", "fullName email")
            .populate("booking", "bookingType status createdAt")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum)
            .lean(),
    ]);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                feedback,
                pagination: {
                    total,
                    page: pageNum,
                    limit: limitNum,
                    totalPages: Math.ceil(total / limitNum),
                },
            },
            "Feedback fetched successfully"
        )
    );
});

// PATCH /api/v1/admin/feedback/toggle-feedback-visibility/:id
const toggleFeedbackVisibility = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { isVisible } = req.body;

    if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, "Invalid feedback ID");
    }

    if (typeof isVisible !== "boolean") {
        throw new ApiError(400, "isVisible must be a boolean");
    }

    const feedback = await Feedback.findByIdAndUpdate(
        id,
        { $set: { isVisible } },
        { new: true }
    );

    if (!feedback) {
        throw new ApiError(404, "Feedback not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, feedback, `Feedback ${isVisible ? "shown" : "hidden"} successfully`));
});

export {
    submitFeedback,
    getMyFeedback,
    getAllFeedback,
    toggleFeedbackVisibility,
};
