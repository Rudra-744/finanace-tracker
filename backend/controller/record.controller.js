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
            createdBy: req.user._id 
        });

        res.status(201).json({ message: "Record created successfully", record: newRecord });
    } catch (error) {
        console.log("Error creating record:", error);
        res.status(500).json({ message: "Error creating record", error });
    }
};

export const getRecords = async (req, res) => {
    try {
        const { type, category } = req.query;
        let queryOptions = {};

        if (type) queryOptions.type = type;
        if (category) queryOptions.category = category;

        const records = await Record.find(queryOptions).sort({ date: -1 });

        res.status(200).json({ 
            message: "Records fetched successfully", 
            results: records.length, 
            records 
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching records", error });
    }
};

export const updateRecord = async (req, res) => {
    try {
        const recordId = req.params.id;
        const updatedData = req.body;

        const updatedRecord = await Record.findByIdAndUpdate(recordId, updatedData, {
            new: true,
            runValidators: true
        });

        if (!updatedRecord) return res.status(404).json({ message: "Record not found" });

        res.status(200).json({ message: "Record updated successfully", record: updatedRecord });
    } catch (error) {
        res.status(500).json({ message: "Error updating record", error });
    }
};

export const deleteRecord = async (req, res) => {
    try {
        const record = await Record.findByIdAndDelete(req.params.id);
        
        if (!record) return res.status(404).json({ message: "Record not found" });

        res.status(200).json({ message: "Record successfully deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting record", error });
    }
};
