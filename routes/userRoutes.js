const express = require("express")
const { loginController, registerController, authController,
    applyDoctorController, getAllNotificationController, deleteAllNotificationController,
    getAllDoctorsController,
    bookAppointmentController,
    bookingAvailabilityController } = require("../controllers/userCtrl")
const authMiddleware = require("../middlewares/authMiddleware")

// router object
const router = express.Router()

// Routes
// login || post
router.post("/login", loginController)

// register || post
router.post("/register", registerController)

// Auth || post
router.post("/getUserData", authMiddleware, authController)

// Apply doctor || post
router.post("/apply-doctor", authMiddleware, applyDoctorController)

// get all notifications || post
router.post("/get-all-notification", authMiddleware, getAllNotificationController)

// delete all notifications || post
router.post("/delete-all-notification", authMiddleware, deleteAllNotificationController)

// get all doctor list || get
router.get("/getAllDoctors", authMiddleware, getAllDoctorsController)

// book-appointment of doctor || post
router.post("/book-appointment", authMiddleware, bookAppointmentController)

// booking availability || post
router.post("/booking-availability", authMiddleware, bookingAvailabilityController)

module.exports = router