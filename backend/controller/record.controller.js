import Record from "../models/Record.js";

export const createRecord = async (req, res) => {
    try {
        const { amount, type, category, notes, date } = req.body;

        const newRecord = await Record.create({
            amount,
            type,
            category,
            notes,
            date: date || Date.now(),
            createdBy: req.user._id,
        });

        res.status(201).json({ message: "Record created successfully", record: newRecord });
    } catch (error) {
        res.status(500).json({ message: "Error creating record", error: error.message });
    }
};

export const getRecords = async (req, res) => {
    try {
        const { type, category, startDate, endDate, page = 1, limit = 20 } = req.query;
        let filter = {};

        if (type) filter.type = type;
        if (category) filter.category = { $regex: category, $options: "i" };
        if (startDate || endDate) {
            filter.date = {};
            if (startDate) filter.date.$gte = new Date(startDate);
            if (endDate) filter.date.$lte = new Date(endDate);
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const totalRecords = await Record.countDocuments(filter);
        const records = await Record.find(filter)
            .sort({ date: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate("createdBy", "name");

        res.status(200).json({
            message: "Records fetched successfully",
            results: records.length,
            totalRecords,
            totalPages: Math.ceil(totalRecords / parseInt(limit)),
            currentPage: parseInt(page),
            records,
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching records", error: error.message });
    }
};

export const updateRecord = async (req, res) => {
    try {
        const updatedRecord = await Record.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!updatedRecord) return res.status(404).json({ message: "Record not found" });

        res.status(200).json({ message: "Record updated successfully", record: updatedRecord });
    } catch (error) {
        res.status(500).json({ message: "Error updating record", error: error.message });
    }
};

export const deleteRecord = async (req, res) => {
    try {
        const record = await Record.findByIdAndDelete(req.params.id);
        if (!record) return res.status(404).json({ message: "Record not found" });

        res.status(200).json({ message: "Record successfully deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting record", error: error.message });
    }
};
