const express = require('express');
const ReportController = require('../controllers/ReportController');

const router = express.Router();

router.post('/', ReportController.addReport);

router.get('/', ReportController.viewReports);

router.get('/:id', ReportController.viewReportById);

router.put('/:id', ReportController.updateReport);

router.delete('/:id', ReportController.removeReport);

module.exports = router;
