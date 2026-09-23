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

const verificationEmail = async (email, verificationToken) => {
  const info = await transporter.sendMail({
    from: '"Example Team" <mdjaber.dev@gmail.com>', // sender address
    to: email, // list of recipients
    subject: "Verification Email", // subject line
    html: `<a href="http://localhost:5000/api/v1/auth/verify/${verificationToken}">Click here to verify your account</a>`, // HTML body
  });
};

const forgetPasswordEmail = async (email, resetPasswordToken) => {
  const info = await transporter.sendMail({
    from: '"Example Team" <mdjaber.dev@gmail.com>', // sender address
    to: email, // list of recipients
    subject: "Reset Password", // subject line
    html: `<a href="http://localhost:5000/api/v1/auth/resetPassword/${resetPasswordToken}">Click here </a>`, // HTML body
  });
};
const categoryCreateEmail = async (adminEmail, categoryName) => {
  const info = await transporter.sendMail({
    from: '"Example Team" <mdjaber.dev@gmail.com>', // sender address
    to: adminEmail, // list of recipients
    subject: "Category create", // subject line
    html: `<p>A new category named <b>"${categoryName}"</b> has been successfully created.</p>`, // HTML body
  });
};
const categoryUpdateEmail = async (adminEmail, categoryUpdateName) => {
  const info = await transporter.sendMail({
    from: '"Example Team" <mdjaber.dev@gmail.com>', // sender address
    to: adminEmail, // list of recipients
    subject: "Category update", // subject line
    html: `<p>A category <b>"${categoryUpdateName}"</b> has been successfully updated.</p>`, // HTML body
  });
};
const categoryDeleteEmail = async (adminEmail, categoryDeleteName) => {
  const info = await transporter.sendMail({
    from: '"Example Team" <mdjaber.dev@gmail.com>', // sender address
    to: adminEmail, // list of recipients
    subject: "Category deleted", // subject line
    html: `<p>A category <b>"${categoryDeleteName}"</b> has been successfully deleted.</p>`, // HTML body
  });
};

module.exports = {
  verificationEmail,
  forgetPasswordEmail,
  categoryCreateEmail,
  categoryUpdateEmail,
  categoryDeleteEmail,
};
