const express = require("express")
const { getDoctorInfoController, updateProfileController, getDoctorByIdController, doctorAppointmentsController, updateStatusController } = require("../controllers/doctorCtrl")
const authMiddleware = require("../middlewares/authMiddleware")
const router = express.Router()

// single doctor info || post
router.post("/getDoctorInfo", authMiddleware, getDoctorInfoController)

// update profile of doctor || post
router.post("/updateProfile", authMiddleware, updateProfileController)

// single doctor info by ID || post
router.post("/getDoctorById", authMiddleware, getDoctorByIdController)

// doctor appointments || get
router.get("/doctor-appointments", authMiddleware, doctorAppointmentsController)

// update status || post
router.post("/update-status", authMiddleware, updateStatusController)

module.exports = router