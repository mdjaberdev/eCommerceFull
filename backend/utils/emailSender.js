const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});


const varificationEmail = async (email)=>{
     const info = await transporter.sendMail({
    from: '"Example Team" mdjaber.dev@gmail.com', // sender address
    to: email, // list of recipients
    subject: "Hello", // subject line
    html: `This is your otp ${otp}`, // HTML body
  });
}

module.exports = varificationEmail;