const appointmentModel = require("../models/appointmentModel")
const doctorModel = require("../models/doctorModel")
const userModel = require("../models/userModels")

// get single doctor's information
const getDoctorInfoController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ userId: req.body.userId })
        res.status(200).send({ success: true, message: "doctor data fetch success", data: doctor })
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: "Error in Fetching Doctor Details", error })
    }
}

// update the doctor's profile
const updateProfileController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOneAndUpdate({ userId: req.body.userId }, req.body)
        res.status(201).send({ success: true, message: "Doctor profile updated", data: doctor })
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: "Error in Updating Doctor's profile", error })
    }
}

// single doctor information by ID
const getDoctorByIdController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ _id: req.body.doctorId })
        res.status(200).send({ success: true, message: "Doctor's information fetched", data: doctor })
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: "Error in getting doctor's information", error })
    }
}

const doctorAppointmentsController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ userId: req.body.userId })
        const appointments = await appointmentModel.find({ doctorId: doctor._id })
        res.status(200).send({ success: true, message: "Doctor's appointments fetched", data: appointments })
    }
    catch (error) {
        res.status(500).send({ success: false, message: "Error in getting doctor's appointments", error })
    }
}

const updateStatusController = async (req, res) => {
    try {
        const { appointmentsId, status } = req.body
        const appointments = await appointmentModel.findByIdAndUpdate(appointmentsId, { status })
        const user = await userModel.findOne({ _id: appointments.userId })
        const notification = user.notification
        notification.push({
            type: "status-updated",
            message: `Your appointment has been updated to ${status}`,
            onCLickPath: "/doctor-appointments",
        })
        await user.save()
        res.status(200).send({ success: true, message: "Appointment status updated" })
    }
    catch (error) {
        res.status(500).send({ success: false, message: "Error in changing the appointment status", error })
    }
}

module.exports = {
    getDoctorInfoController, updateProfileController, getDoctorByIdController,
    doctorAppointmentsController, updateStatusController
}