import User from "../models/User.js";

export async function getProfile(req, res) {
    try {
        const user = await User.findById(req.userId).select("-password");
        
        if (!user) {
            return res.status(404).json({
                msg: "User not found"
            });
        }

        res.status(200).json({
            userID: user.userID,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
        });
    } catch (err) {
        res.status(500).json({
            msg: err.message
        });
    }
}

export async function updateProfile(req, res) {
    try {
        const { name, email } = req.body;
        
        const user = await User.findByIdAndUpdate(
            req.userId,
            { name, email },
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                msg: "User not found"
            });
        }

        res.status(200).json({
            msg: "Profile updated successfully",
            user: {
                userID: user.userID,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({
            msg: err.message
        });
    }
}

export async function changePassword(req, res) {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                msg: "Current password and new password are required"
            });
        }

        const user = await User.findById(req.userId);
        
        if (!user) {
            return res.status(404).json({
                msg: "User not found"
            });
        }

        const bcrypt = await import("bcrypt");
        const isMatch = await bcrypt.default.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({
                msg: "Current password is incorrect"
            });
        }

        const salt = await bcrypt.default.genSalt(10);
        const hashedPassword = await bcrypt.default.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            msg: "Password changed successfully"
        });
    } catch (err) {
        res.status(500).json({
            msg: err.message
        });
    }
}

export async function getAllUsers(req, res) {
    try {
        const users = await User.find().select("-password");
        
        res.status(200).json({
            total: users.length,
            users: users
        });
    } catch (err) {
        res.status(500).json({
            msg: err.message
        });
    }
}

export async function deleteUser(req, res) {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({
                msg: "User not found"
            });
        }

        res.status(200).json({
            msg: "User deleted successfully",
            userID: user.userID
        });
    } catch (err) {
        res.status(500).json({
            msg: err.message
        });
    }
}
