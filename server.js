require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

const connectDB = require("./config/db");
connectDB();


// Middleware
app.use(express.json());
app.use(cors());


// Routes
const projects = require("./routes/projectRoutes");
const resumeHandle = require("./routes/resumeRoutes");
const visitorCount = require("./routes/authRoutes");
const dashboard = require("./routes/adminRoutes");
const auth = require("./routes/authRoutes");
const notify = require("./routes/notifyRoutes");

app.use("/api/v1/projects", projects);
app.use("/api/v1/resume", resumeHandle);
//app.use("/api/v1/visitors", visitorCount);
app.use("/api/v1/visitor", notify);
app.use("/api/v1/admin", dashboard);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`APP is running on ${PORT}`);
});