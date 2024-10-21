const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    name: { type: String, required: true },
    disease: { type: String, required: true },
    level: { type: String, required: true },
    symptomsDate: { type: Date, required: true },
});

const Report = mongoose.model('Report', ReportSchema);

module.exports = Report;
