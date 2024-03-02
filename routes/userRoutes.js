const express = require("express")
const { loginController, registerController, authController,
    applyDoctorController, getAllNotificationController, deleteAllNotificationController } = require("../controllers/userCtrl")
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

module.exports = router