const userModel = require("../models/userModels")
const doctorModel = require("../models/doctorModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const appointmentModel = require("../models/appointmentModel")
const moment = require("moment")

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

// get all doctors controller
const getAllDoctorsController = async (req, res) => {
    try {
        const doctors = await doctorModel.find({ status: "approved" })
        res.status(200).send({ success: true, message: "Doctors' list shown successfully", data: doctors })
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: "Unable to get doctors' list", error })
    }
}

// book appointments of doctor controller
const bookAppointmentController = async (req, res) => {
    try {
        req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString()
        req.body.time = moment(req.body.time, "HH:mm").toISOString()
        req.body.status = "pending"
        const newAppointment = new appointmentModel(req.body)
        await newAppointment.save()
        const user = await userModel.findOne({ _id: req.body.doctorInfo.userId })
        user.notification.push({
            type: "New-appointment-request",
            message: `A new appointment request from ${req.body.userInfo.name}`,
            onCLickPath: "/user/appointments",
        })
        await user.save()
        res.status(200).send({ success: true, message: "Appointment Booked successfully" })
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: "Unable to book the appointment", error })
    }
}

// booking availability controller
const bookingAvailabilityController = async (req, res) => {
    try {
        const date = moment(req.body.date, "DD-MM-YY").toISOString()
        const fromTime = moment(req.body.time, "HH:mm").subtract(1, "hours").toISOString()
        const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString()
        const doctorId = req.body.doctorId
        const appointments = await appointmentModel.find({
            doctorId,
            date,
            time: {
                $gte: fromTime,
                $lte: toTime,
            },
        })
        if (appointments.length > 0) {
            return res.status(200).send({
                message: "Appointments not availibale at this time",
                success: true,
            })
        } else {
            return res.status(200).send({
                success: true,
                message: "Appointments available",
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error In Booking",
        })
    }
}

module.exports = {
    loginController, registerController, authController,
    applyDoctorController, getAllNotificationController, deleteAllNotificationController,
    getAllDoctorsController, bookAppointmentController, bookingAvailabilityController
}