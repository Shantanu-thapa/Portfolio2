const express = require("express");
const router = express.Router();

const protect = require("../middleware/authmiddleware");

const {
    getDashboardStats
} = require("../controller/admin");


// Protected - Dashboard Stats
router.get("/stats", protect, getDashboardStats);


module.exports = router;