import mongoose from "mongoose";

const staffScheduleSchema = new mongoose.Schema({
    canteen: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "canteen",
        required: true
    },
    staff: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: String, // HH:MM format
        required: true
    },
    endTime: {
        type: String, // HH:MM format
        required: true
    },
    position: {
        type: String,
        enum: ["counter", "kitchen", "supervisor", "cashier", "staff"],
        default: "counter"
    },
    status: {
        type: String,
        enum: ["scheduled", "present", "absent", "left_early", "on_leave"],
        default: "scheduled"
    },
    notes: {
        type: String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
},
{
    timestamps: true
});

// Index for quick lookups by date and canteen
staffScheduleSchema.index({ canteen: 1, date: 1 });
staffScheduleSchema.index({ canteen: 1, staff: 1, date: 1 }, { unique: true });

const StaffSchedule = mongoose.model("staffschedule", staffScheduleSchema);
export default StaffSchedule;
