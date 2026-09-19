const Project = require("../model/projectModel");
const {title,githubLink,liveLink} = require("../model/projectModel");

// Add Project
const addProject = async (req, res) => {
    try {
        const {
            title,
            githubLink,
            liveLink,
            
        } = req.body;

        if (!title) {
            return res.status(400).json({
                message: "Title is required"
            });
        }

        const project = await Project.create({
            title,
            githubLink,
            liveLink,
        });

        res.status(201).json({
            message: "Project added successfully",
            project
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to add project",
            error: error.message
        });
    }
};


// Get All Projects
const getProjects = async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });

        res.status(200).json({
            projects
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch projects",
            error: error.message
        });
    }
};


// Delete Project
const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;

        const project = await Project.findByIdAndDelete(id);

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        res.status(200).json({
            message: "Project deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete project",
            error: error.message
        });
    }
};


module.exports = {
    addProject,
    getProjects,
    deleteProject
};