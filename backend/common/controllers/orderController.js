import Order from "../models/Order.js";
import Canteen from "../models/Canteen.js";

// Helper to calculate next available time slot
const calculateNextSlot = async (canteenID) => {
    const canteen = await Canteen.findById(canteenID);
    if (!canteen) throw new Error("Canteen not found");

    const slotDuration = canteen.slotDurationMinutes || 5;
    const maxOrders = canteen.maxOrdersPerSlot || 10;

    let now = new Date();
    // Round to nearest slot duration if needed, or just start from now
    // For simplicity, let's start from the current time rounded up to the next 5-min interval
    let startMinutes = Math.ceil(now.getMinutes() / slotDuration) * slotDuration;
    let slotStart = new Date(now.setMinutes(startMinutes, 0, 0));

    let foundSlot = false;
    let assignedSlot = null;

    while (!foundSlot) {
        const startTimeStr = slotStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        const slotEnd = new Date(slotStart.getTime() + slotDuration * 60000);
        const endTimeStr = slotEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        const dateStr = slotStart.toISOString().split('T')[0];

        // Count existing orders in this slot
        const orderCount = await Order.countDocuments({
            canteen: canteenID,
            "timeSlot.startTime": startTimeStr,
            "timeSlot.date": dateStr,
            status: { $ne: 'Cancelled' }
        });

        if (orderCount < maxOrders) {
            assignedSlot = {
                startTime: startTimeStr,
                endTime: endTimeStr,
                date: dateStr
            };
            foundSlot = true;
        } else {
            // Move to next slot
            slotStart = new Date(slotStart.getTime() + slotDuration * 60000);
        }
    }

    return assignedSlot;
};

export const placeOrder = async (req, res) => {
    try {
        const { canteenID, items, totalPrice, paymentMethod } = req.body;
        const today = new Date().toISOString().split('T')[0]; // From authenticate middleware

        const nextSlot = await calculateNextSlot(canteenID);

        const newOrder = new Order({
            student: req.userId,
            canteen: canteenID,
            items,
            totalPrice,
            timeSlot: nextSlot,
            date: today,
            paymentMethod: paymentMethod === 'Card' ? 'Card' : 'Cash',
            paymentStatus: paymentMethod === 'Card' ? 'Paid' : 'Pending',
            status: "Pending"
        });

        await newOrder.save();
        res.status(201).json({ message: "Order placed successfully", order: newOrder });
    } catch (error) {
        console.error("placeOrder Error:", error);
        res.status(500).json({ message: error.message, stack: error.stack, errorObj: error });
    }
};

export const createPOSOrder = async (req, res) => {
    try {
        const { canteenID } = req.params;
        const { items, totalPrice, paymentMethod } = req.body;
        const today = new Date().toISOString().split('T')[0];

        // Instead of time slot, it's an immediate Walk-in order
        const timeSlot = {
            startTime: "Walk-in",
            endTime: "Walk-in",
            date: today
        };

        const newOrder = new Order({
            student: req.userId, // Using the Staff's ID as the purchaser
            canteen: canteenID,
            items,
            totalPrice,
            timeSlot,
            date: today,
            paymentMethod: paymentMethod || 'Cash',
            paymentStatus: 'Paid',   // Instantly marked Paid since staff took cash
            status: "Completed"      // Instantly marked Complete for walk-in
        });

        await newOrder.save();
        res.status(201).json({ message: "POS Order placed", order: newOrder });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getStudentOrders = async (req, res) => {
    try {
        const studentID = req.userId;
        const orders = await Order.find({ student: studentID })
            .populate('canteen', 'name location')
            .sort({ createdAt: -1 });
        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCanteenOrders = async (req, res) => {
    try {
        const { canteenID } = req.params;
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        const currentTimeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

        // Auto-update late orders
        await Order.updateMany(
            {
                canteen: canteenID,
                "timeSlot.date": today,
                "timeSlot.endTime": { $lt: currentTimeStr },
                status: 'Pending'
            },
            { status: 'Late' }
        );

        const orders = await Order.find({
            canteen: canteenID,
            "timeSlot.date": today
        })
            .populate('student', 'name userID')
            .sort({ "timeSlot.startTime": 1, orderID: 1 });

        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { orderID, status, paymentStatus } = req.body;

        let updateData = { status };
        if (paymentStatus) {
            updateData.paymentStatus = paymentStatus;
        }

        const order = await Order.findOneAndUpdate(
            { _id: orderID }, // We are querying by Mongoose _id in the frontend
            updateData,
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ message: "Order updated successfully", order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCanteenHistory = async (req, res) => {
    try {
        const { canteenID } = req.params;
        const orders = await Order.find({
            canteen: canteenID,
            status: { $in: ['Completed', 'Failed'] }
        })
            .populate('student', 'name email')
            .sort({ updatedAt: -1 })
            .limit(100); // Last 100 for safety

        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCanteenAnalytics = async (req, res) => {
    try {
        const { canteenID } = req.params;
        // Basic stats aggregation
        const stats = await Order.aggregate([
            { $match: { canteen: new mongoose.Types.ObjectId(canteenID), status: 'Completed' } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalPrice" },
                    totalOrders: { $sum: 1 }
                }
            }
        ]);

        // Top Items aggregation
        const topItems = await Order.aggregate([
            { $match: { canteen: new mongoose.Types.ObjectId(canteenID), status: 'Completed' } },
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.name",
                    totalSold: { $sum: "$items.quantity" },
                    revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: 3 }
        ]);

        res.status(200).json({
            revenue: stats[0]?.totalRevenue || 0,
            orders: stats[0]?.totalOrders || 0,
            topItems: topItems.map(item => ({ name: item._id, sold: item.totalSold, rev: item.revenue }))
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
