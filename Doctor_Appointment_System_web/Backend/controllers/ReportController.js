const Report = require('../models/Report');

const addReport = async (req, res) => {
    try {
        const { name, disease, level, symptomsDate } = req.body;
        const newReport = new Report({ name, disease, level, symptomsDate });
        const savedReport = await newReport.save();
        res.status(201).json(savedReport);
    } catch (error) {
        res.status(500).json({ error: "Failed to add report" });
    }
};

const viewReports = async (req, res) => {
    try {
        const reports = await Report.find();
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve reports" });
    }
};

const viewReportById = async (req, res) => {
    try {
        const { id } = req.params;
        const report = await Report.findById(id);
        if (!report) {
            return res.status(404).json({ error: "Report not found" });
        }
        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ error: "Failed to view report" });
    }
};

const updateReport = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updatedReport = await Report.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedReport) {
            return res.status(404).json({ error: "Report not found" });
        }
        res.status(200).json(updatedReport);
    } catch (error) {
        res.status(500).json({ error: "Failed to update report" });
    }
};

const removeReport = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Report.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ error: "Report not found" });
        }
        res.status(200).json({ message: "Report removed successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to remove report" });
    }
};

module.exports = {
    addReport,
    viewReports,
    viewReportById,
    updateReport,
    removeReport,
};
