const doctorModel = require("../models/doctorModel")
const userModel = require("../models/userModels")

const getAllUsersController = async (req, res) => {
    try {
        const users = await userModel.find({})
        res.status(200).send({ success: true, message: "Users Data List", data: users })
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: "Error while fetching users data", error })
    }
}

const getAllDoctorsController = async (req, res) => {
    try {
        const doctors = await doctorModel.find({})
        res.status(200).send({ success: true, message: "Doctors Data List", data: doctors })
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: "Error while fetching doctors data", error })
    }
}

// doctor account status controller
const changeAccountStatusController = async (req, res) => {
    try {
        // status of doctor updated from pending to approved
        const { doctorID, status } = req.body
        const doctor = await doctorModel.findByIdAndUpdate(doctorID, { status })
        const user = await userModel.findOne({ _id: doctor.userId })
        const notification = user.notification
        notification.push({
            type: "doctot-account-request-updated",
            message: `Your doctor account has been updated to ${status}`,
            onClickPath: "/notification"
        })
        // user isDoctor updated from false to true
        user.isDoctor = status === "approved" ? true : false
        console.log(user)
        await user.save()
        res.status(200).send({ success: true, message: "Doctor's Account Status Updated", data: doctor })
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: "Error in account status", error })
    }
}

module.exports = { getAllUsersController, getAllDoctorsController, changeAccountStatusController }