import express from "express";
import {
    placeOrder,
    getStudentOrders,
    getCanteenOrders,
    updateOrderStatus,
    getCanteenHistory,
    getCanteenAnalytics,
    createPOSOrder,
    getOrderById,
    getAvailableSlots,
    getGlobalAnalytics,
    generateAdminReport,
    getQueueFCFS,
    getCookingOrders,
    getReadyOrders,
    getDeliveredOrders,
    getOrderStatusSummary,
    startCooking,
    getAllOrdersByStatus
} from "../controllers/orderController.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";

const orderRouter = express.Router();

orderRouter.post("/place", authenticate, placeOrder);
orderRouter.get("/student", authenticate, getStudentOrders);
orderRouter.get("/canteen/:canteenID/slots", authenticate, getAvailableSlots);
orderRouter.get("/:orderID", authenticate, getOrderById);

// Staff routes
orderRouter.get("/canteen/:canteenID", authenticate, authorize("admin", "staff"), getCanteenOrders);
orderRouter.get("/canteen/:canteenID/history", authenticate, authorize("admin", "staff"), getCanteenHistory);
orderRouter.get("/canteen/:canteenID/analytics", authenticate, authorize("admin", "staff"), getCanteenAnalytics);
orderRouter.patch("/status", authenticate, authorize("admin", "staff"), updateOrderStatus);
orderRouter.post("/canteen/:canteenID/pos", authenticate, authorize("admin", "staff"), createPOSOrder);

// ===== NEW QUEUE & STATUS TRACKING ROUTES =====
// Queue Management (FCFS)
orderRouter.get("/queue/:canteenID/fcfs", authenticate, authorize("admin", "staff"), getQueueFCFS);

// Order Status Routes
orderRouter.get("/status/:canteenID/cooking", authenticate, authorize("admin", "staff"), getCookingOrders);
orderRouter.get("/status/:canteenID/ready", authenticate, authorize("admin", "staff"), getReadyOrders);
orderRouter.get("/status/:canteenID/delivered", authenticate, authorize("admin", "staff"), getDeliveredOrders);
orderRouter.get("/status/:canteenID/summary", authenticate, authorize("admin", "staff"), getOrderStatusSummary);
orderRouter.get("/status/:canteenID/all", authenticate, authorize("admin", "staff"), getAllOrdersByStatus);

// Start Cooking
orderRouter.patch("/:orderID/start-cooking", authenticate, authorize("admin", "staff"), startCooking);

// Admin global routes
orderRouter.get("/global/analytics", authenticate, authorize("admin"), getGlobalAnalytics);
orderRouter.get("/global/reports", authenticate, authorize("admin"), generateAdminReport);

export default orderRouter;
