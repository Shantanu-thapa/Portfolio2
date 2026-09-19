const resend = require("../config/resend");
const {name,email,phone} = require("../model/visitorModel");

const notification = async (req, res) => {
    const { name, email, phone } = req.body;

    try {

        // Email to visitor/recruiter
       const visitorEmail = await resend.emails.send({
            from: "Portfolio <onboarding@resend.dev>",
            to: [email],
            subject: "Thank you for reaching out",
            text: `Hello ${name},

Thank you for considering Shantanu's profile. He will be connecting with you shortly.

Best regards,
Shantanu Thapa`
        });

        if (visitorEmail.error) {
            throw new Error(visitorEmail.error.message);
        }


       // Notification to Shantanu
        const ownerEmail = await resend.emails.send({
            from: "Portfolio <onboarding@resend.dev>",
            to: [process.env.EMAIL_USER],
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
            message: "Emails sent successfully"
        });

    } catch (error) {

        console.error("Resend error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to send emails",
            error: error.message
        });
    }
};

module.exports = { notification };