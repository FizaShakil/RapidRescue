import mongoose, { Schema } from "mongoose";

const feedbackSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        // unique here means one review per booking, no duplicates
        booking: {
            type: Schema.Types.ObjectId,
            ref: "Booking",
            required: true,
            unique: true,
        },
        rating: {
            type: Number,
            required: true,
            min: [1, "Rating must be at least 1"],
            max: [5, "Rating cannot exceed 5"],
        },
        comment: {
            type: String,
            trim: true,
            maxlength: [500, "Comment cannot exceed 500 characters"],
        },
        // admin can hide a review without deleting it
        isVisible: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// used when fetching all feedback submitted by a specific user
feedbackSchema.index({ user: 1 });

export const Feedback = mongoose.model("Feedback", feedbackSchema);
