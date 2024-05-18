const express = require("express")
const { getAllUsersController, getAllDoctorsController, changeAccountStatusController } = require("../controllers/adminCtrl")
const authMiddleware = require("../middlewares/authMiddleware")

// router object
const router = express.Router()

// users || get
router.get("/getAllUsers", authMiddleware, getAllUsersController)

// doctors || get
router.get("/getAllDoctors", authMiddleware, getAllDoctorsController)

// account status || post
router.post("/changeAccountStatus", authMiddleware, changeAccountStatusController)

module.exports = router