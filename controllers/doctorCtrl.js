const doctorModel = require("../models/doctorModel");

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

module.exports = { getDoctorInfoController, updateProfileController }