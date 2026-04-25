import Cart from "../models/Cart.js";
import FoodItem from "../models/FoodItem.js";
import Canteen from "../models/Canteen.js";

// Get student's cart
export const getCart = async (req, res) => {
    try {
        const studentID = req.userId;
        let cart = await Cart.findOne({ student: studentID })
            .populate('canteen', 'name location')
            .populate('items.foodItem', 'name image price description');

        if (!cart) {
            return res.status(404).json({ message: "Cart is empty" });
        }

        res.status(200).json({ cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add item to cart
export const addToCart = async (req, res) => {
    try {
        const studentID = req.userId;
        const { canteenID, foodItemID, quantity = 1 } = req.body;

        // Validate inputs
        if (!canteenID || !foodItemID || quantity < 1) {
            return res.status(400).json({ message: "Invalid input. Provide canteenID, foodItemID, and quantity >= 1" });
        }

        // Check if food item exists and get its details
        const foodItem = await FoodItem.findById(foodItemID);
        if (!foodItem) {
            return res.status(404).json({ message: "Food item not found" });
        }

        // Check if canteen exists
        const canteen = await Canteen.findById(canteenID);
        if (!canteen) {
            return res.status(404).json({ message: "Canteen not found" });
        }

        // Find or create cart
        let cart = await Cart.findOne({ student: studentID });

        if (!cart) {
            // Create new cart
            cart = new Cart({
                student: studentID,
                canteen: canteenID,
                items: [{
                    foodItem: foodItemID,
                    name: foodItem.name,
                    quantity,
                    price: foodItem.price,
                    image: foodItem.image
                }]
            });
        } else {
            // Check if switching canteens
            if (cart.canteen.toString() !== canteenID) {
                return res.status(400).json({
                    message: "You can only add items from one canteen. Clear your cart first.",
                    currentCanteen: cart.canteen
                });
            }

            // Check if item already in cart
            const existingItem = cart.items.find(item => item.foodItem.toString() === foodItemID);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({
                    foodItem: foodItemID,
                    name: foodItem.name,
                    quantity,
                    price: foodItem.price,
                    image: foodItem.image
                });
            }
        }

        await cart.save();
        await cart.populate('canteen', 'name location');
        await cart.populate('items.foodItem', 'name image price description');

        res.status(200).json({ message: "Item added to cart", cart });
    } catch (error) {
        console.error("addToCart Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Update item quantity in cart
export const updateCartItem = async (req, res) => {
    try {
        const studentID = req.userId;
        const { foodItemID, quantity } = req.body;

        if (!foodItemID || !quantity || quantity < 1) {
            return res.status(400).json({ message: "Invalid input. Provide foodItemID and quantity >= 1" });
        }

        const cart = await Cart.findOne({ student: studentID });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const item = cart.items.find(i => i.foodItem.toString() === foodItemID);
        if (!item) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        item.quantity = quantity;
        await cart.save();
        await cart.populate('canteen', 'name location');
        await cart.populate('items.foodItem', 'name image price description');

        res.status(200).json({ message: "Cart updated", cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
    try {
        const studentID = req.userId;
        const { foodItemID } = req.body;

        if (!foodItemID) {
            return res.status(400).json({ message: "Provide foodItemID" });
        }

        let cart = await Cart.findOne({ student: studentID });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = cart.items.filter(item => item.foodItem.toString() !== foodItemID);

        // If cart is empty, delete it
        if (cart.items.length === 0) {
            await Cart.deleteOne({ _id: cart._id });
            return res.status(200).json({ message: "Cart is now empty. Cart deleted." });
        }

        await cart.save();
        await cart.populate('canteen', 'name location');
        await cart.populate('items.foodItem', 'name image price description');

        res.status(200).json({ message: "Item removed from cart", cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Clear entire cart
export const clearCart = async (req, res) => {
    try {
        const studentID = req.userId;

        const result = await Cart.deleteOne({ student: studentID });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Cart not found" });
        }

        res.status(200).json({ message: "Cart cleared successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Checkout - Convert cart to order
export const checkoutCart = async (req, res) => {
    try {
        const studentID = req.userId;
        const { paymentMethod, redeemPoints, timeSlot } = req.body;

        const cart = await Cart.findOne({ student: studentID });
        if (!cart || cart.items.length === 0) {
            return res.status(404).json({ message: "Cart is empty" });
        }

        // Validate payment method
        if (!['Card', 'Cash', 'Wallet'].includes(paymentMethod)) {
            return res.status(400).json({ message: "Invalid payment method" });
        }

        // Import here to avoid circular dependency
        const Order = (await import("../models/Order.js")).default;
        const User = (await import("../models/User.js")).default;

        const user = await User.findById(studentID);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Calculate final price with points
        let finalPrice = cart.totalPrice;
        if (redeemPoints && redeemPoints > 0) {
            if (user.loyaltyPoints < redeemPoints) {
                return res.status(400).json({ message: "Insufficient loyalty points" });
            }
            const maxRedeemable = Math.min(finalPrice, user.loyaltyPoints);
            const actuallyRedeemed = Math.min(redeemPoints, maxRedeemable);
            finalPrice -= actuallyRedeemed;
            user.loyaltyPoints -= actuallyRedeemed;
        }

        // Check wallet balance
        if (paymentMethod === 'Wallet' && user.walletBalance < finalPrice) {
            return res.status(400).json({ message: "Insufficient wallet balance" });
        }

        // Create order from cart
        const newOrder = new Order({
            student: studentID,
            canteen: cart.canteen,
            items: cart.items,
            totalPrice: finalPrice,
            timeSlot: timeSlot || undefined,
            paymentMethod,
            paymentStatus: ['Card', 'Wallet'].includes(paymentMethod) ? 'Paid' : 'Pending',
            status: "Pending"
        });

        await newOrder.save();

        // Update wallet if paid via wallet
        if (paymentMethod === 'Wallet') {
            user.walletBalance -= finalPrice;
            const Transaction = (await import("../models/Transaction.js")).default;
            const walletTx = new Transaction({
                user: studentID,
                amount: finalPrice,
                type: 'DEBIT',
                description: `Paid for Order via Wallet`,
                order: newOrder._id
            });
            await walletTx.save();
        }

        // Award loyalty points
        const earnedPoints = Math.floor(cart.totalPrice / 100);
        user.loyaltyPoints += earnedPoints;
        await user.save();

        // Clear cart
        await Cart.deleteOne({ _id: cart._id });

        res.status(201).json({
            message: "Order placed successfully from cart",
            order: newOrder,
            pointsEarned: earnedPoints
        });
    } catch (error) {
        console.error("checkoutCart Error:", error);
        res.status(500).json({ message: error.message });
    }
};
