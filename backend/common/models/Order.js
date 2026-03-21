import mongoose from "mongoose";
import Counter from "./Counter.js";

const orderSchema = new mongoose.Schema({
    orderID: {
        type: String,
        unique: true
    },
    orderToken: {
        type: String,
        unique: true,
        // Auto-generate a dummy string to bypass the old MongoDB E11000 index error
        default: () => new mongoose.Types.ObjectId().toString()
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    canteen: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "canteen",
        required: true
    },
    items: [{
        // In a full system, this would reference a MenuItem. For now, we can store simple object representations or strings to fulfill the request requirements.
        name: { type: String, required: true },
        quantity: { type: Number, required: true, default: 1 },
        price: { type: Number, required: true }
    }],
    totalPrice: {
        type: Number,
        required: true
    },
    timeSlot: {
        startTime: { type: String, required: true }, // e.g., "12:10"
        endTime: { type: String, required: true },   // e.g., "12:15"
        date: { type: String, required: true }       // e.g., "2026-03-21"
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed'],
        default: 'Pending'
    },
    paymentMethod: {
        type: String, // 'Card' or 'Cash'
        enum: ['Card', 'Cash'],
        default: 'Cash'
    },
    status: {
        type: String,
        enum: ['Pending', 'Preparing', 'Ready', 'Completed', 'Late'],
        default: 'Pending'
    },
    pickupTime: {
        type: Date
    }
},
    {
        timestamps: true // Gives us createdAt for sorting and logic
    });

// Auto-increment order ID middleware
orderSchema.pre("save", async function () {
    if (!this.isNew) {
        return;
    }
    const counter = await Counter.findOneAndUpdate(
        { id: "order_id" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    // Generates an ID like EN-0045
    this.orderID = `EN-${counter.seq.toString().padStart(3, '0')}`;
});

const Order = mongoose.model("order", orderSchema);
export default Order;
