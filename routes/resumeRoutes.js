const express = require("express");
const router = express.Router();

const protect = require("../middleware/authmiddleware");
const upload = require ("../middleware/multer");

const {
    uploadResume,
    myResume,
    updateResume,
    downloadResume,
} = require("../controller/resumeControl");


// Public - Get active resume
router.get("/resume", myResume);


// Protected - Upload resume
router.post(
    "/upload",
    protect,
    upload.single("resume"),
    uploadResume
);


// Protected - Update resume
router.put(
    "/update",
    protect,
    upload.single("resume"),
    updateResume
);

router.get('/resume/download',downloadResume);


module.exports = router;
