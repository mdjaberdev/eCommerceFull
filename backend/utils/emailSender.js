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


const verificationEmail = async (email, token)=>{
     const info = await transporter.sendMail({
       from: '"Example Team" <mdjaber.dev@gmail.com>', // sender address
       to: email, // list of recipients
       subject: "Verification Email", // subject line
       html: `This is your token ${token}`, // HTML body
     });
  return info
}

const forgetPassEmail = async (email, token)=>{
   const info = await transporter.sendMail({
       from: '"Example Team" <mdjaber.dev@gmail.com>', // sender address
       to: email, // list of recipients
       subject: "Forget Password", // subject line
       html: `This is your token ${token}`, // HTML body
     });
  return info
}

module.exports = { verificationEmail, forgetPassEmail };