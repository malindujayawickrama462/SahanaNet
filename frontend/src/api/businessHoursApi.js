const API_URL = "/api/business";

// Get business hours for canteen
export const getBusinessHours = async (canteenId) => {
    const res = await fetch(`${API_URL}/hours/${canteenId}`, {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("smartqueue_token")}`
        }
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to fetch business hours");
    }
    return res.json();
};

// Update business hours
export const updateBusinessHours = async (canteenId, hoursData) => {
    const res = await fetch(`${API_URL}/hours/${canteenId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("smartqueue_token")}`
        },
        body: JSON.stringify(hoursData)
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to update business hours");
    }
    return res.json();
};

// Get today's staff schedule
export const getStaffTodaySchedule = async (canteenId) => {
    const res = await fetch(`${API_URL}/schedule/today/${canteenId}`, {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("smartqueue_token")}`
        }
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to fetch today's staff");
    }
    return res.json();
};

// Get staff schedule for date range
export const getStaffSchedule = async (canteenId, startDate, endDate) => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    
    const res = await fetch(`${API_URL}/schedule/${canteenId}?${params}`, {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("smartqueue_token")}`
        }
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to fetch staff schedule");
    }
    return res.json();
};

// Add staff to schedule
export const addStaffToSchedule = async (canteenId, staffData) => {
    const res = await fetch(`${API_URL}/schedule/${canteenId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("smartqueue_token")}`
        },
        body: JSON.stringify(staffData)
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to add staff to schedule");
    }
    return res.json();
};

// Remove staff from schedule
export const removeStaffFromSchedule = async (scheduleId) => {
    const res = await fetch(`${API_URL}/schedule/${scheduleId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("smartqueue_token")}`
        }
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to remove staff from schedule");
    }
    return res.json();
};

// Update schedule status
export const updateScheduleStatus = async (scheduleId, status) => {
    const res = await fetch(`${API_URL}/schedule/${scheduleId}/status`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("smartqueue_token")}`
        },
        body: JSON.stringify({ status })
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to update status");
    }
    return res.json();
};

// Get all staff in canteen
export const getCanteenStaff = async (canteenId) => {
    const res = await fetch(`${API_URL}/staff/${canteenId}`, {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("smartqueue_token")}`
        }
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to fetch canteen staff");
    }
    return res.json();
};
