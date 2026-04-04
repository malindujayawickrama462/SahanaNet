import express from "express";
import {
    getBusinessHours,
    updateBusinessHours,
    getStaffTodaySchedule,
    getStaffSchedule,
    addStaffToSchedule,
    removeStaffFromSchedule,
    updateScheduleStatus,
    getCanteenStaff
} from "../controllers/businessHoursController.js";
import { authenticate } from "../middleware/authenticate.js";

const businessHoursRouter = express.Router();

// Business Hours Routes
businessHoursRouter.get("/hours/:canteenId", authenticate, getBusinessHours);
businessHoursRouter.put("/hours/:canteenId", authenticate, updateBusinessHours);

// Staff Schedule Routes
businessHoursRouter.get("/schedule/today/:canteenId", authenticate, getStaffTodaySchedule);
businessHoursRouter.get("/schedule/:canteenId", authenticate, getStaffSchedule);
businessHoursRouter.post("/schedule/:canteenId", authenticate, addStaffToSchedule);
businessHoursRouter.delete("/schedule/:scheduleId", authenticate, removeStaffFromSchedule);
businessHoursRouter.put("/schedule/:scheduleId/status", authenticate, updateScheduleStatus);

// Canteen Staff Routes
businessHoursRouter.get("/staff/:canteenId", authenticate, getCanteenStaff);

export default businessHoursRouter;
