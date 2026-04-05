import User from "../models/User.js";

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json({ results: users.length, users });
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
};

export const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        if (!["viewer", "analyst", "admin"].includes(role)) {
            return res.status(400).json({ message: "Invalid role. Must be viewer, analyst, or admin." });
        }

        const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ message: "User role updated", user });
    } catch (error) {
        res.status(500).json({ message: "Error updating user role", error: error.message });
    }
};

export const toggleUserStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.isActive = !user.isActive;
        await user.save();

        res.status(200).json({
            message: `User ${user.isActive ? "activated" : "deactivated"} successfully`,
            user: { id: user._id, name: user.name, email: user.email, role: user.role, isActive: user.isActive },
        });
    } catch (error) {
        res.status(500).json({ message: "Error toggling user status", error: error.message });
    }
};
