import { useSelector, useDispatch } from 'react-redux'
import Layout from './../../components/Layout'
import React, { useEffect, useState } from 'react'
import { Col, Form, Input, Row, TimePicker, message } from "antd"
import { useNavigate } from 'react-router-dom'
import { hideLoading, showLoading } from '../../redux/features/alertSlice'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import moment from "moment"

const Profile = () => {
    const { user } = useSelector((state) => state.user)
    const [doctor, setDoctor] = useState(null)
    const params = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleFinish = async (values) => {
        try {
            dispatch(showLoading())
            const res = await axios.post("/api/v1/doctor/updateProfile", {
                ...values, userId: user._id,
                timings: [
                    moment(values.timings[0]).format("HH:mm"),
                    moment(values.timings[1]).format("HH:mm"),
                ]
            },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                })
            dispatch(hideLoading())
            if (res.data.success) {
                message.success(res.data.message)
                navigate("/")
            }
            else {
                message.error(res.data.message)
            }
        }
        catch (error) {
            dispatch(hideLoading())
            console.log(error)
            message.error("Something went wrong")
        }
    }

    //get doctor details
    const getDoctorInfo = async () => {
        try {
            const res = await axios.post("/api/v1/doctor/getDoctorInfo", {
                userId: params.id
            },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            )
            if (res.data.success) {
                setDoctor(res.data.data);
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getDoctorInfo()
        //eslint-disable-next-line
    }, [])

    return (
        <Layout>
            <h1>Manage Profile</h1>

            {/* doctor form */}
            {doctor && (
                <Form layout="vertical" className="m-3" onFinish={handleFinish}
                    initialValues={{
                        ...doctor,
                        timings: [
                            moment(doctor.timings[0], "HH:mm"),
                            moment(doctor.timings[1], "HH:mm"),
                        ],
                    }}>
                    <h4 className="">Personal Details: </h4>
                    <Row gutter={20}>
                        <Col xs={24} md={24} lg={8}>
                            <Form.Item label="First Name" name="firstName" required rules={[{ required: true }]}>
                                <Input type="text" placeholder="your first name" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={8}>
                            <Form.Item label="Last Name" name="lastName" required rules={[{ required: true }]}>
                                <Input type="text" placeholder="your last name" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={8}>
                            <Form.Item label="Email ID" name="email" required rules={[{ required: true }]}>
                                <Input type="email" placeholder="your email" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={8}>
                            <Form.Item label="Phone Number" name="phone" required rules={[{ required: true }]}>
                                <Input type="text" placeholder="your contact number" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={8}>
                            <Form.Item label="Address" name="address" required rules={[{ required: true }]}>
                                <Input type="text" placeholder="your clinic address" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={8}>
                            <Form.Item label="Website" name="website">
                                <Input type="text" placeholder="your website" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <h4 className="">Professional Details: </h4>
                    <Row gutter={20}>
                        <Col xs={24} md={24} lg={8}>
                            <Form.Item label="Specialization" name="specialization" required rules={[{ required: true }]}>
                                <Input type="text" placeholder="your specialization" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={8}>
                            <Form.Item label="Experience" name="experience" required rules={[{ required: true }]} >
                                <Input type="text" placeholder="your experience" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={8}>
                            <Form.Item label="Fees Per Cunsaltation" name="feesPerConsultation" required rules={[{ required: true }]}>
                                <Input type="text" placeholder="your fees" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={8}>
                            <Form.Item label="Timings" name="timings" required>
                                <TimePicker.RangePicker format="HH:mm" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={8}></Col>
                        <Col xs={24} md={24} lg={8}>
                            <button className="btn btn-primary form-btn" type="submit">
                                Update
                            </button>
                        </Col>
                    </Row>
                </Form>
            )}
        </Layout>
    )
}

export default Profile