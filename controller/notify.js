const { req,res } = require("express");
const transporter = require("../config/email");


const notification = async (req,res) => {
    const {name , email , phone} = req.body

    try{
        await transporter.sendMail({
            from : process.env.EMAIL_USER,
            to : email ,
            subject: "Thank you for reaching out",
            text : `Hello ${name},
            Thank you for considering Shantanu's profile. He will be connecting with you shortly,


            Best Regards,
            Shantanu Thapa`

        })

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject : "New Portfolio Contact" ,
            text : `Hello Shantanu ,
            Someone is interested in your profile , 
            Details are given below -


         ${name},
         ${email},
         ${phone} `
        })
            res.status(200).json({ message: "Confirmation email sent to visitor" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
    
module.exports = {notification};