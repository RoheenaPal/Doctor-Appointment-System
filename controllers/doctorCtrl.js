const doctorModel = require("../models/doctorModel")

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
        res.status(500).send({ success: false, message: "Error in gettig doctor's information", error })
    }
}

module.exports = { getDoctorInfoController, updateProfileController, getDoctorByIdController }