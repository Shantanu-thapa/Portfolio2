const VisitorCount = require("../model/visitorCount");

// Track Visitor
const trackVisitor = async (req, res) => {
    try {
        const visitor = await VisitorCount.findOneAndUpdate(
            {},
            { $inc: { count: 1 } },
            {
                new: true,
                upsert: true
            }
        );

        res.status(200).json({
            success: true,
            count: visitor.count
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to track visitor"
        });
    }
};


// Get Visitor Count
const getVisitorCount = async (req, res) => {
    try {
        const visitor = await VisitorCount.findOne({});

        res.status(200).json({
            success: true,
            count: visitor ? visitor.count : 0
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch visitor count"
        });
    }
};


module.exports = {
    trackVisitor,
    getVisitorCount
};