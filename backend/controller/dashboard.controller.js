import Record from "../models/Record.js";

export const getDashboardStats = async (req, res) => {
    try {
        const summary = await Record.aggregate([
            {
                $group: {
                    _id: "$type",
                    totalAmount: { $sum: "$amount" },
                    count: { $sum: 1 },
                },
            },
        ]);

        let totalIncome = 0;
        let totalExpense = 0;

        summary.forEach((item) => {
            if (item._id === "income") totalIncome = item.totalAmount;
            else totalExpense = item.totalAmount;
        });

        res.status(200).json({
            message: "Dashboard stats fetched successfully",
            stats: {
                totalIncome,
                totalExpense,
                netBalance: totalIncome - totalExpense,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching dashboard summary" });
    }
};

export const getCategoryTotals = async (req, res) => {
    try {
        const categoryData = await Record.aggregate([
            {
                $group: {
                    _id: { type: "$type", category: "$category" },
                    totalAmount: { $sum: "$amount" },
                    count: { $sum: 1 },
                },
            },
            { $sort: { totalAmount: -1 } },
        ]);

        const formatted = categoryData.map((item) => ({
            type: item._id.type,
            category: item._id.category,
            totalAmount: item.totalAmount,
            count: item.count,
        }));

        res.status(200).json({
            message: "Category-wise totals fetched",
            categories: formatted,
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching category totals" });
    }
};

export const getRecentActivity = async (req, res) => {
    try {
        const recent = await Record.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate("createdBy", "name email");

        res.status(200).json({
            message: "Recent activity fetched",
            records: recent,
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching recent activity" });
    }
};

export const getMonthlyTrends = async (req, res) => {
    try {
        const trends = await Record.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$date" },
                        month: { $month: "$date" },
                        type: "$type",
                    },
                    totalAmount: { $sum: "$amount" },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]);

        const formatted = trends.map((item) => ({
            year: item._id.year,
            month: item._id.month,
            type: item._id.type,
            totalAmount: item.totalAmount,
        }));

        res.status(200).json({
            message: "Monthly trends fetched",
            trends: formatted,
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching monthly trends" });
    }
};