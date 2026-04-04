import mongoose from "mongoose";

const businessHoursSchema = new mongoose.Schema({
    canteen: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "canteen",
        required: true,
        unique: true
    },
    monday: {
        isOpen: { type: Boolean, default: true },
        openTime: { type: String, default: "08:00" }, // HH:MM format
        closeTime: { type: String, default: "18:00" }
    },
    tuesday: {
        isOpen: { type: Boolean, default: true },
        openTime: { type: String, default: "08:00" },
        closeTime: { type: String, default: "18:00" }
    },
    wednesday: {
        isOpen: { type: Boolean, default: true },
        openTime: { type: String, default: "08:00" },
        closeTime: { type: String, default: "18:00" }
    },
    thursday: {
        isOpen: { type: Boolean, default: true },
        openTime: { type: String, default: "08:00" },
        closeTime: { type: String, default: "18:00" }
    },
    friday: {
        isOpen: { type: Boolean, default: true },
        openTime: { type: String, default: "08:00" },
        closeTime: { type: String, default: "18:00" }
    },
    saturday: {
        isOpen: { type: Boolean, default: false },
        openTime: { type: String, default: "10:00" },
        closeTime: { type: String, default: "16:00" }
    },
    sunday: {
        isOpen: { type: Boolean, default: false },
        openTime: { type: String, default: "10:00" },
        closeTime: { type: String, default: "16:00" }
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
},
{
    timestamps: true
});

const BusinessHours = mongoose.model("businesshours", businessHoursSchema);
export default BusinessHours;
