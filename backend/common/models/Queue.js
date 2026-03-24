import mongoose from "mongoose";

const queueSchema = new mongoose.Schema({
    canteen: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "canteen",
        required: true
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "order",
        required: true
    },
    queuePosition: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Cooking', 'Ready', 'Collected', 'Cancelled'],
        default: 'Pending'
    },
    estimatedTime: {
        type: Date
    },
    actualStartTime: {
        type: Date
    },
    actualEndTime: {
        type: Date
    }
}, {
    timestamps: true
});

// Compound index for efficient queue retrieval
queueSchema.index({ canteen: 1, status: 1, queuePosition: 1 });
queueSchema.index({ order: 1 }, { unique: true });

const Queue = mongoose.model("queue", queueSchema);
export default Queue;
