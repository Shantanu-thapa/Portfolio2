const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
    {
        resumeURL: {
            type: String,
            required: true,
            trim: true,
        },

        publicId: {
            type: String,
            required: true,
            trim: true,
        },

        fileName: {
            type: String,
            required: true,
            trim: true,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
            downloadCount: {
            type: Number,
            default: 0
        },
    },
    {
        timestamps: true,
    }
);

const Resume = mongoose.model("Resume", resumeSchema);

module.exports = Resume;