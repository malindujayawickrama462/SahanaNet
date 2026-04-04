import BusinessHours from "../models/BusinessHours.js";
import StaffSchedule from "../models/StaffSchedule.js";
import User from "../models/User.js";
import CanteenStaff from "../models/CanteenStaff.js";

// Get or create business hours for a canteen
export const getBusinessHours = async (req, res) => {
    try {
        const { canteenId } = req.params;

        let businessHours = await BusinessHours.findOne({ canteen: canteenId });
        
        if (!businessHours) {
            // Create default business hours if doesn't exist
            businessHours = new BusinessHours({ canteen: canteenId });
            await businessHours.save();
        }

        res.status(200).json({ businessHours });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update business hours
export const updateBusinessHours = async (req, res) => {
    try {
        const { canteenId } = req.params;
        const { monday, tuesday, wednesday, thursday, friday, saturday, sunday } = req.body;

        let businessHours = await BusinessHours.findOne({ canteen: canteenId });
        
        if (!businessHours) {
            businessHours = new BusinessHours({ canteen: canteenId });
        }

        // Update each day
        if (monday) businessHours.monday = monday;
        if (tuesday) businessHours.tuesday = tuesday;
        if (wednesday) businessHours.wednesday = wednesday;
        if (thursday) businessHours.thursday = thursday;
        if (friday) businessHours.friday = friday;
        if (saturday) businessHours.saturday = saturday;
        if (sunday) businessHours.sunday = sunday;

        businessHours.updatedBy = req.userId;
        await businessHours.save();

        res.status(200).json({ message: "Business hours updated successfully", businessHours });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get staff working today
export const getStaffTodaySchedule = async (req, res) => {
    try {
        const { canteenId } = req.params;

        // Get today's date
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const staffSchedules = await StaffSchedule.find({
            canteen: canteenId,
            date: { $gte: today, $lt: tomorrow }
        })
            .populate('staff', 'name email userID _id')
            .sort({ startTime: 1 });

        res.status(200).json({ 
            count: staffSchedules.length,
            staff: staffSchedules 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get staff by date range
export const getStaffSchedule = async (req, res) => {
    try {
        const { canteenId } = req.params;
        const { startDate, endDate } = req.query;

        const query = { canteen: canteenId };

        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const staffSchedules = await StaffSchedule.find(query)
            .populate('staff', 'name email userID _id')
            .sort({ date: 1, startTime: 1 });

        res.status(200).json({ staffSchedules });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add staff to schedule
export const addStaffToSchedule = async (req, res) => {
    try {
        const { canteenId } = req.params;
        const { staffId, date, startTime, endTime, position, notes } = req.body;

        // Validate required fields
        if (!staffId || !date || !startTime || !endTime) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Check if staff is assigned to this canteen
        const staffAssignment = await CanteenStaff.findOne({
            canteen: canteenId,
            staff: staffId
        });

        if (!staffAssignment) {
            return res.status(400).json({ message: "Staff member is not assigned to this canteen" });
        }

        const scheduleDate = new Date(date);
        scheduleDate.setHours(0, 0, 0, 0);

        // Check if schedule already exists
        let schedule = await StaffSchedule.findOne({
            canteen: canteenId,
            staff: staffId,
            date: scheduleDate
        });

        if (schedule) {
            // Update existing schedule
            schedule.startTime = startTime;
            schedule.endTime = endTime;
            schedule.position = position || schedule.position;
            schedule.notes = notes;
        } else {
            // Create new schedule
            schedule = new StaffSchedule({
                canteen: canteenId,
                staff: staffId,
                date: scheduleDate,
                startTime,
                endTime,
                position: position || "counter",
                createdBy: req.userId
            });
        }

        await schedule.save();
        await schedule.populate('staff', 'name email userID _id');

        res.status(201).json({ message: "Staff added to schedule", schedule });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Remove staff from schedule
export const removeStaffFromSchedule = async (req, res) => {
    try {
        const { scheduleId } = req.params;

        const schedule = await StaffSchedule.findByIdAndDelete(scheduleId);

        if (!schedule) {
            return res.status(404).json({ message: "Schedule not found" });
        }

        res.status(200).json({ message: "Staff removed from schedule", schedule });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update staff schedule status
export const updateScheduleStatus = async (req, res) => {
    try {
        const { scheduleId } = req.params;
        const { status } = req.body;

        if (!status || !["scheduled", "present", "absent", "left_early", "on_leave"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const schedule = await StaffSchedule.findByIdAndUpdate(
            scheduleId,
            { status },
            { new: true }
        ).populate('staff', 'name email userID _id');

        if (!schedule) {
            return res.status(404).json({ message: "Schedule not found" });
        }

        res.status(200).json({ message: "Status updated", schedule });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all staff assigned to canteen
export const getCanteenStaff = async (req, res) => {
    try {
        const { canteenId } = req.params;

        const staffMembers = await CanteenStaff.find({ canteen: canteenId })
            .populate('staff', 'name email userID _id')
            .populate('assignedBy', 'name');

        res.status(200).json({ staff: staffMembers });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
