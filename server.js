// Entry point
const express = require("express")
const colors = require("colors")
const morgan = require("morgan")
const dotenv = require("dotenv")
const connectDB = require("./config/db")
const app = express()
const port = process.env.PORT || 8080

// config dotenv
dotenv.config()

// mongodb connection
connectDB()

// middleware
app.use(express.json())
app.use(morgan("dev"))

// Routes
app.use("/api/v1/user", require("./routes/userRoutes"))

// listen port
app.listen(port, (req, res) => {
    console.log(`Server is running on port ${port}`)
})