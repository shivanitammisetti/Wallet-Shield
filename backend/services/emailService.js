const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

exports.sendOTP = async (email, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "WalletShield OTP Verification",
    text: `Your OTP is ${otp}`
  })
}