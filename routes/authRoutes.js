const express = require("express");

const router = express.Router();
const{login,signup} = require("../controller/auth");

const protect = require("../middleware/authmiddleware");


router.post("/login" , login );
router.post("/signup", signup);
module.exports = router;
