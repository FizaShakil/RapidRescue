import mongoose, { Schema } from "mongoose";

// each driver has one User account (for login) and one Driver profile (for operational data)
const driverSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        licenseNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        certifications: {
            type: [String],
            default: [],
        },
        // set to false when assigned to a booking, back to true when done
        isAvailable: {
            type: Boolean,
            default: true,
        },
        // on_duty/off_duty is set by admin or driver themselves
        // en_route/busy is set automatically during a booking
        status: {
            type: String,
            enum: ["on_duty", "off_duty", "en_route", "busy"],
            default: "off_duty",
        },
        currentLocation: {
            lat: { type: Number },
            lng: { type: Number },
        },
        // which ambulance this driver is currently using
        assignedAmbulance: {
            type: Schema.Types.ObjectId,
            ref: "Ambulance",
            default: null,
        },
    },
    { timestamps: true }
);

// used to find drivers who are free and on duty during dispatch
driverSchema.index({ isAvailable: 1, status: 1 });

export const Driver = mongoose.model("Driver", driverSchema);
