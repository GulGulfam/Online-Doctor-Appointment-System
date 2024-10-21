const express = require('express');
const multer = require('multer');
const path = require('path');
const AdminController = require('../controllers/AdminController');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

router.post('/doctor/add', AdminController.adddoctor);
router.put('/doctor/update/:id', AdminController.updatedoctor);
router.delete('/doctor/remove/:id', AdminController.removedoctor);
router.get('/doctor/view/:id', AdminController.viewdoctor);
router.get('/doctor/viewall', AdminController.viewallDoctors);

router.post('/clinic/add', upload.single('image'), AdminController.addclinic);
router.get('/clinic/view', AdminController.viewclinic);
router.put('/clinic/update', AdminController.updateclinic);
router.delete('/clinic/remove/:id', AdminController.removeclinic);
router.get('/users/view', AdminController.viewusers);

module.exports = router;
