import mongoose, { Schema } from "mongoose";

// kept separate from the user profile because this is sensitive health data
// users manage their own, admins can view any, drivers get read access during active jobs
const medicalProfileSchema = new Schema(
    {
        // one profile per user, enforced by unique
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        bloodGroup: {
            type: String,
            enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        },
        allergies: {
            type: [String],
            default: [],
        },
        chronicConditions: {
            type: [String],
            default: [],
        },
        currentMedications: {
            type: [String],
            default: [],
        },
        // max 3 contacts, validated below
        emergencyContacts: {
            type: [
                {
                    name: { type: String, required: true, trim: true },
                    phone: { type: String, required: true, trim: true },
                    relation: { type: String, trim: true },
                },
            ],
            validate: {
                validator: function (v) {
                    return v.length <= 3;
                },
                message: "A maximum of 3 emergency contacts are allowed",
            },
            default: [],
        },
        notes: {
            type: String,
            trim: true,
            maxlength: [500, "Notes cannot exceed 500 characters"],
        },
    },
    { timestamps: true }
);

export const MedicalProfile = mongoose.model("MedicalProfile", medicalProfileSchema);
