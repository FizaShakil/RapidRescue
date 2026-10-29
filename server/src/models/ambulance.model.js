import mongoose, { Schema } from "mongoose";

const ambulanceSchema = new Schema(
    {
        registrationNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            uppercase: true,
        },
        // BLS = Basic Life Support, ALS = Advanced Life Support, ICU = mobile ICU
        vehicleType: {
            type: String,
            enum: ["BLS", "ALS", "ICU"],
            required: true,
        },
        // flips to false when dispatched, back to true when the job is done
        isAvailable: {
            type: Boolean,
            default: true,
        },
        // updated by the driver while on a job
        currentLocation: {
            lat: { type: Number },
            lng: { type: Number },
        },
        // null when not on a job
        assignedDriver: {
            type: Schema.Types.ObjectId,
            ref: "Driver",
            default: null,
        },
        assignedBooking: {
            type: Schema.Types.ObjectId,
            ref: "Booking",
            default: null,
        },
        lastServiceDate: {
            type: Date,
        },
        notes: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

// used in dispatch to find ambulances that are free right now
ambulanceSchema.index({ isAvailable: 1 });

export const Ambulance = mongoose.model("Ambulance", ambulanceSchema);
