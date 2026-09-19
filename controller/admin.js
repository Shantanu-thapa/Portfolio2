const Project = require("../model/projectModel");
const Resume = require("../model/resumeModel");
const Visitor = require("../model/visitorCount");


// Get Dashboard Stats
const getDashboardStats = async (req, res) => {
    try {
        const projectCount = await Project.countDocuments();

        const visitor = await Visitor.findOne({});
        const visitorCount = visitor ? visitor.count : 0;

        const resume = await Resume.findOne({
            isActive: true
        });

        const resumeDownloadCount = resume
            ? resume.downloadCount
            : 0;

        res.status(200).json({
            success: true,
            stats: {
                projectCount,
                visitorCount,
                resumeDownloadCount
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard stats",
            error: error.message
        });
    }
};


module.exports = {
    getDashboardStats
};