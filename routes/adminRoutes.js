const express = require("express")
const { getAllUsersController, getAllDoctorsController } = require("../controllers/adminCtrl")
const authMiddleware = require("../middlewares/authMiddleware")

// router object
const router = express.Router()

// users || get
router.get("/getAllUsers", authMiddleware, getAllUsersController)

// doctors || get
router.get("/getAllDoctors", authMiddleware, getAllDoctorsController)

module.exports = router