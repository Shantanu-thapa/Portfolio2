const resend = require("../config/resend");

const notification = async (req, res) => {
    const { name, email, phone } = req.body;

    try {
        const ownerEmail = await resend.emails.send({
            from: "Portfolio <onboarding@resend.dev>",
            to: ["shantanuthapa124@gmail.com"],
            subject: "New Portfolio Contact",
            text: `A new visitor has contacted you through your portfolio.

Name: ${name}
Email: ${email}
Phone: ${phone}

Please follow up with them if required.

Best regards,
Portfolio Contact System`
        });

        if (ownerEmail.error) {
            throw new Error(ownerEmail.error.message);
        }

        res.status(200).json({
            success: true,
            message: "Message sent successfully"
        });

    } catch (error) {
        console.error("Resend error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to send message",
            error: error.message
        });
    }
};

module.exports = { notification };
