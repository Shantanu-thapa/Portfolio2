const express = require("express");
const router = express.Router();

const protect = require("../middleware/authmiddleware");
const upload = require("../middleware/multer");

const {
    uploadResume,
    myResume,
    updateResume,
    downloadResume
} = require("../controller/resumeControl");


// Get active resume
router.get("/resume", myResume);


// Upload resume
router.post(
    "/resume/upload",
    protect,
    upload.single("resume"),
    uploadResume
);


// Update resume
router.put(
    "/resume/update",
    protect,
    upload.single("resume"),
    updateResume
);


// Download resume
router.get("/resume/download", downloadResume);


module.exports = router;
