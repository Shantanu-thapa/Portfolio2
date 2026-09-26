const Resume = require("../model/resumeModel");
const cloudinary = require("../config/cloudinary");
const axios = require("axios");

// ==========================================
// Upload Resume
// ==========================================
const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a PDF file"
            });
        }

        // Upload PDF to Cloudinary
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "portfolio/resume",
                    resource_type: "raw",
                    use_filename: true,
                    unique_filename: true
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

        // Save resume in MongoDB
        const resume = await Resume.create({
            resumeURL: result.secure_url,
            publicId: result.public_id,
            fileName: req.file.originalname,
            isActive: true,
            downloadCount: 0
        });

        return res.status(201).json({
            success: true,
            message: "Resume uploaded successfully",
            resume
        });

    } catch (error) {
        console.error("Upload Resume Error:", error);

        return res.status(500).json({
            success: false,
            message: "Resume upload failed",
            error: error.message
        });
    }
};


// ==========================================
// Get Active Resume
// ==========================================
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

        return res.status(200).json({
            success: true,
            message: "Resume found",
            resume
        });

    } catch (error) {
        console.error("Get Resume Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch resume",
            error: error.message
        });
    }
};


// ==========================================
// Update Resume
// ==========================================
const updateResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a new PDF file"
            });
        }

        // Find current active resume
        const oldResume = await Resume.findOne({
            isActive: true
        });

        // Upload new resume to Cloudinary
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "portfolio/resume",
                    resource_type: "raw",
                    use_filename: true,
                    unique_filename: true
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
            try {
                await cloudinary.uploader.destroy(
                    oldResume.publicId,
                    {
                        resource_type: "raw"
                    }
                );
            } catch (cloudinaryError) {
                console.error(
                    "Old Cloudinary file deletion failed:",
                    cloudinaryError.message
                );
            }

            oldResume.isActive = false;
            await oldResume.save();
        }

        // Create new active resume
        const resume = await Resume.create({
            resumeURL: result.secure_url,
            publicId: result.public_id,
            fileName: req.file.originalname,
            isActive: true,
            downloadCount: 0
        });

        return res.status(200).json({
            success: true,
            message: "Resume updated successfully",
            resume
        });

    } catch (error) {
        console.error("Update Resume Error:", error);

        return res.status(500).json({
            success: false,
            message: "Resume update failed",
            error: error.message
        });
    }
};


// ==========================================
// Download Resume
// ==========================================
const downloadResume = async (req, res) => {
    try {
        const resume = await Resume.findOneAndUpdate(
            { isActive: true },
            { $inc: { downloadCount: 1 } },
            { new: true }
        );

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: "Resume not found"
            });
        }

        if (!resume.resumeURL) {
            return res.status(404).json({
                success: false,
                message: "Resume URL not found"
            });
        }

        const cloudinaryResponse = await fetch(resume.resumeURL);

        if (!cloudinaryResponse.ok) {
            throw new Error("Failed to fetch resume from Cloudinary");
        }

        const pdfBuffer = Buffer.from(
            await cloudinaryResponse.arrayBuffer()
        );

        res.setHeader("Content-Type", "application/pdf");

        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${resume.fileName || "resume.pdf"}"`
        );

        res.setHeader(
            "Content-Length",
            pdfBuffer.length
        );

        return res.send(pdfBuffer);

    } catch (error) {
        console.error("Download Resume Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to download resume",
            error: error.message
        });
    }
};


// ==========================================
// Export Controllers
// ==========================================
module.exports = {
    uploadResume,
    myResume,
    updateResume,
    downloadResume
};
