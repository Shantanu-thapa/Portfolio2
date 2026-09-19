const express = require("express");

const router = express.Router();

const protect = require("../middleware/authmiddleware");



const {
    notification
} = require("../controller/notifynew");





// Public - Visitor contact / interest
router.post("/contact", notification);



module.exports = router;