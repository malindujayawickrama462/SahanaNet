import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
        unique: true
    },
    canteen: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "canteen",
        required: true
    },
    items: [{
        foodItem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "fooditem",
            required: true
        },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, default: 1, min: 1 },
        price: { type: Number, required: true },
        image: { type: String }
    }],
    totalPrice: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Calculate total price before saving
cartSchema.pre("save", function (next) {
    this.totalPrice = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    next();
});

const Cart = mongoose.model("cart", cartSchema);
export default Cart;
