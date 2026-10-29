import mongoose, { Schema } from "mongoose";

const bookingSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        bookingType: {
            type: String,
            enum: ["emergency", "non_emergency"],
            required: true,
        },
        // status moves forward one step at a time, transitions are validated in the controller
        status: {
            type: String,
            enum: [
                "pending",       // just created, waiting for admin to act
                "confirmed",     // admin confirmed it, ambulance and driver assigned
                "en_route",      // driver is on the way to the patient
                "arrived",       // driver reached the pickup location
                "transporting",  // patient is inside the ambulance
                "completed",     // job finished
                "cancelled",     // cancelled by user or admin
            ],
            default: "pending",
        },
        pickupLocation: {
            address: { type: String, required: true, trim: true },
            lat: { type: Number },
            lng: { type: Number },
        },
        // drop location is optional, especially for emergencies where destination isn't known upfront
        dropLocation: {
            address: { type: String, trim: true },
            lat: { type: Number },
            lng: { type: Number },
        },
        // patient might be a different person than whoever booked
        patientName: {
            type: String,
            required: true,
            trim: true,
        },
        patientPhone: {
            type: String,
            required: true,
            trim: true,
        },
        emergencyDescription: {
            type: String,
            trim: true,
        },
        // these two are set by admin during dispatch, never from the client
        assignedAmbulance: {
            type: Schema.Types.ObjectId,
            ref: "Ambulance",
            default: null,
        },
        assignedDriver: {
            type: Schema.Types.ObjectId,
            ref: "Driver",
            default: null,
        },
        // only relevant for non-emergency bookings
        scheduledAt: {
            type: Date,
        },
        completedAt: {
            type: Date,
        },
        cancelledAt: {
            type: Date,
        },
        cancelReason: {
            type: String,
            trim: true,
        },
        driverNotes: {
            type: String,
            trim: true,
        },
        // linked at booking time if the user has a medical profile, helps the driver
        medicalProfile: {
            type: Schema.Types.ObjectId,
            ref: "MedicalProfile",
            default: null,
        },
    },
    { timestamps: true }
);

// used when a user fetches their own bookings with an optional status filter
bookingSchema.index({ user: 1, status: 1 });

// used for admin dispatch queue, filtered by status
bookingSchema.index({ status: 1 });

// used when a driver fetches their assigned bookings
bookingSchema.index({ assignedDriver: 1 });

// used when admin filters bookings by type (emergency / non_emergency)
bookingSchema.index({ bookingType: 1 });

export const Booking = mongoose.model("Booking", bookingSchema);
