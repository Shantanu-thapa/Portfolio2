const express = require("express");
const router = express.Router();

const protect = require("../middleware/authmiddleware");

const {
    addProject,
    getProjects,
    deleteProject
} = require("../controller/project")


// Public - Get all projects
router.get("/myprojects", getProjects);


// Protected - Add project
router.post("/add", protect, addProject);


// Protected - Delete project
router.delete("/:id", protect, deleteProject);


module.exports = router;