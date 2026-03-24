const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { generateOTP } = require("../services/otpService")
const { sendOTP } = require("../services/emailService")

// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body

    let user = await User.findOne({ email })

    const hashedPassword = await bcrypt.hash(password, 10)

    const otp = generateOTP().toString()

    if (user) {
      // 🔥 UPDATE EXISTING USER OTP
      user.otp = otp
      user.otpExpires = Date.now() + 5 * 60 * 1000
      await user.save()

      await sendOTP(email, otp)

      return res.json({ message: "OTP resent successfully" })
    }

    // 🆕 NEW USER
    user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      otp,
      otpExpires: Date.now() + 5 * 60 * 1000
    })

    await user.save()

    await sendOTP(email, otp)

    res.json({
      message: "OTP sent successfully",
      userId: user._id
    })

  } catch (err) {
    console.error(err)
    res.status(500).json(err)
  }
}


// ================= VERIFY OTP =================
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({ message: "User not found" })
    }

    console.log("Entered OTP:", otp)
    console.log("Stored OTP:", user.otp)

    // ❌ CHECK EXPIRY
    if (!user.otpExpires || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP expired" })
    }

    // ❌ CHECK OTP MATCH
    if (user.otp !== otp.toString()) {
      return res.status(400).json({ message: "Invalid OTP" })
    }

    // ✅ SUCCESS
    user.isVerified = true
    user.otp = null
    user.otpExpires = null

    await user.save()

    res.json({ message: "OTP verified successfully ✅" })

  } catch (err) {
    console.error(err)
    res.status(500).json(err)
  }
}


// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" })
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: "Please verify OTP first" })
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    )

    res.json({
      message: "Login successful",
      token,
      user
    })

  } catch (err) {
    console.error(err)
    res.status(500).json(err)
  }
}





// const User = require("../models/User")
// const bcrypt = require("bcryptjs")
// const jwt = require("jsonwebtoken")

// exports.register = async (req, res) => {

//  try {

//   const {name,email,password} = req.body

//   const existingUser = await User.findOne({ email })

//   if(existingUser){
//    return res.status(400).json({message:"User already exists"})
//   }

//   const hashedPassword = await bcrypt.hash(password,10)

//   const user = new User({
//     name,
//     email,
//     password: hashedPassword
//   })

//   await user.save()

//   res.json({message:"User registered successfully"})

//  } catch(err){
//   res.status(500).json(err)
//  }

// }

// exports.login = async (req,res)=>{

//  try{

//   const {email,password} = req.body

//   const user = await User.findOne({email})

//   if(!user) return res.status(400).json({message:"User not found"})

//   const isMatch = await bcrypt.compare(password,user.password)

//   if(!isMatch) return res.status(400).json({message:"Invalid credentials"})

//   // const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
//   const token = jwt.sign(
//   {id:user._id},
//   process.env.JWT_SECRET,
//   {expiresIn:"1d"}
// )

//   res.json({token,user})

//  }catch(err){
//   res.status(500).json(err)
//  }

// }