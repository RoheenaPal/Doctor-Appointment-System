const express = require("express")
const { getDoctorInfoController, updateProfileController } = require("../controllers/doctorCtrl")
const authMiddleware = require("../middlewares/authMiddleware")
const router = express.Router()

// single doctor info || post
router.post("/getDoctorInfo", authMiddleware, getDoctorInfoController)

// update profile of doctor || post
router.post("/updateProfile", authMiddleware, updateProfileController)

module.exports = router