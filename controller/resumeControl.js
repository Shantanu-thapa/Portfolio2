const Resume = require("../model/resumeModel");
const cloudinary = require("../config/cloudinary");

// Upload Resume
const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a PDF file"
            });
        }

        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "portfolio/resume",
                    resource_type: "raw"
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );

            stream.end(req.file.buffer);
        });

        const resume = await Resume.create({
            resumeURL: result.secure_url,
            publicId: result.public_id,
            fileName: req.file.originalname,
            isActive: true
        });

        res.status(201).json({
            success: true,
            message: "Resume uploaded successfully",
            resume
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Resume upload failed",
            error: error.message
        });
    }
};


// Get Active Resume
const myResume = async (req, res) => {
    try {
        const resume = await Resume.findOne({
            isActive: true
        }).sort({ createdAt: -1 });

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: "Resume not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Resume found",
            resume
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch resume",
            error: error.message
        });
    }
};


// Update Resume
const updateResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a new PDF file"
            });
        }

        const oldResume = await Resume.findOne({
            isActive: true
        });

        // Upload new resume to Cloudinary
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "portfolio/resume",
                    resource_type: "raw"
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );

            stream.end(req.file.buffer);
        });

        // Delete old Cloudinary file
        if (oldResume) {
            await cloudinary.uploader.destroy(
                oldResume.publicId,
                {
                    resource_type: "raw"
                }
            );

            oldResume.isActive = false;
            await oldResume.save();
        }

        // Create new active resume
        const resume = await Resume.create({
            resumeURL: result.secure_url,
            publicId: result.public_id,
            fileName: req.file.originalname,
            isActive: true
        });

        res.status(200).json({
            success: true,
            message: "Resume updated successfully",
            resume
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Resume update failed",
            error: error.message
        });
    }
};

const downloadResume = async (req, res) => {
    try {
        const resume = await Resume.findOneAndUpdate(
            { isActive: true },
            { $inc: { downloadCount: 1 } },
            {
                new: true
            }
        );

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: "Resume not found"
            });
        }

        res.status(200).json({
            success: true,
            resumeURL: resume.resumeURL,
            fileName: resume.fileName
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to download resume"
        });
    }
};


module.exports = {
    uploadResume,
    myResume,
    updateResume,
    downloadResume,
};
