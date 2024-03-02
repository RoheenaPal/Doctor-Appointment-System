const userModel = require("../models/userModels")
const doctorModel = require("../models/doctorModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

// register handler
const registerController = async (req, res) => {
    try {
        const existingUser = await userModel.findOne({ email: req.body.email })
        if (existingUser) {
            res.status(200).send({ success: false, message: "User already exists." })
        }
        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        req.body.password = hashedPassword
        const newUser = new userModel(req.body)
        await newUser.save()
        res.status(201).send({ success: true, message: "User registered succesfully" })
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: `Register Controller ${error.message}` })
    }
}


// login callback
const loginController = async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email })
        if (!user) {
            return res.status(200).send({ success: false, message: "User not found" })
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password)
        if (!isMatch) {
            return res.status(200).send({ success: false, message: "Invalid email or password" })
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" })
        res.status(200).send({ success: true, message: "Login Successful", token })
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: `Login Controller ${error.message}` })
    }
}

// auth controller
const authController = async (req, res) => {
    try {
        const user = await userModel.findById({ _id: req.body.userId })
        user.password = undefined
        if (!user) {
            return res.status(200).send({ success: false, message: "User not found" })
        }
        else {
            res.status(200).send({
                success: true,
                data: user
            })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: "Authorization error", error })
    }
}

// apply doctor controller
const applyDoctorController = async (req, res) => {
    try {
        const newDoctor = await doctorModel({ ...req.body, status: "pending" })
        await newDoctor.save()
        const adminUser = await userModel.findOne({ isAdmin: true })
        const notification = adminUser.notification
        notification.push({
            type: "apply-doctor-request",
            message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a Doctor Account.`,
            data: {
                doctorId: newDoctor.__id,
                name: newDoctor.firstName + " " + newDoctor.lastName,
                onClickPath: "/admin/doctors"
            }
        })
        await userModel.findByIdAndUpdate(adminUser._id, { notification })
        res.status(201).send({ success: true, message: "Doctor account applied successfully" })
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: "Error while applyting for doctor", error })
    }
}

// get notifications controller
const getAllNotificationController = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.body.userId })
        const seenNotification = user.seenNotification
        const notification = user.notification
        seenNotification.push(...notification)
        user.notification = []
        user.seenNotification = notification
        const updatedUser = await user.save()
        res.status(200).send({ success: true, message: "All notifications marked as read", data: updatedUser })
    }
    catch (error) {
        console.log(error)
        res.status(500).message({ succes: false, message: "Error in notifications", error })
    }
}

// delete notifications controller
const deleteAllNotificationController = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.body.userId })
        user.notification = []
        user.seenNotification = []
        const updatedUser = await user.save()
        updatedUser.password = undefined
        res.status(200).send({ success: true, message: "Notifications Deleted successfully", data: updatedUser })
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: "Unable to delete all notifications", error });
    }
}

module.exports = {
    loginController, registerController, authController,
    applyDoctorController, getAllNotificationController, deleteAllNotificationController
}