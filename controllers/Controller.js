const userModel = require('../models/Model.js')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer')
require("dotenv").config()
var crypto = require('crypto');
const iv = 1
let otp;

function generate_otp() {
    otp = Math.floor(Math.random() * 1000000)
}


const signUp = async (req, res) => {
    const { usernameup, emailup, passup } = req.body
    try {
        const existinguser = await userModel.findOne({ email: emailup })
        if (existinguser) {
            return res.status(400).json({ message: "User already exist" })
        }
        const hashedPassword = await bcrypt.hash(passup, 10)
        const result = await userModel.create({
            email: emailup,
            username: usernameup,
            password: hashedPassword
        })
        // const token = jwt.sign({ email: result.email, id: result._id }, process.env.SECRET_KEY)
        // res.status(201).json({ user: result, token: token })
        res.status(201).json({ user: result })
    } catch (error) {
        res.status(500).json({ message: "something went wrong", msg: error.message })
    }
}

const signIn = async (req, res) => {
    const { emailin, passin } = req.body
    try {
        const existinguser = await userModel.findOne({ email: emailin })
        if (!existinguser) {
            return res.status(400).json({ message: "User not found" })
        }
        const matchPassword = await bcrypt.compare(passin, existinguser.password)
        if (!matchPassword) {
            return res.status(400).json({ message: "Invalid credentials" })
        }
        const token = jwt.sign({ email: existinguser.email, id: existinguser._id }, process.env.SECRET_KEY)
        res.status(201).json({ user: existinguser, token: token })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "something went wrong" })
    }
}

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'amaanshaikh786420@gmail.com',
        pass: process.env.GMAIL_PASSWORD
    }
});
const forgotPassword = async (req, res) => {
    try {
        var emailforgot = req.body
        generate_otp()
        var mailOptions = {
            from: 'amaanshaikh786420@gmail.com',
            to: emailforgot.emailforgot,
            subject: `OTP verification`,
            text: `Your OTP is ${otp}`
        };
        await transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                res.status(400).json({ message: "Email sent UNsuccessfully", err: error.message })
            } else {
                // var encrypt = crypto.createCipheriv('aes256', process.env.SYMMETRIC_KEY,iv);
                // encrypt.update(emailforgot.emailforgot, 'utf8', 'hex');
                // const encrypted = encrypt.final('hex')
                // res.redirect(307,`/otp_verify/${encrypted}`)
                res.redirect(307,`/otp_verify/${emailforgot.emailforgot}`)
            }
        });
    } catch (error) {
        res.status(400).json({ message: error.message })
    }

}

const forgotPass = async (req, res) => {
    return res.render("forgotPass")
}

const otp_verify = async (req, res) => {
    try {
        const otp_get = req.body.otp
        const new_password = req.body.newpass
        const email = req.params.email
        console.log(email)
        // var decrypt = crypto.createDecipheriv('aes256', process.env.SYMMETRIC_KEY,iv);
        // decrypt.update(email, 'hex', 'utf8')
        // decrypt.final()
        if (otp_get == otp) {
            const hashedPassword = await bcrypt.hash(new_password, 10)
            const existinguser = await userModel.findOneAndUpdate({ email: email }, { password: hashedPassword })
            return res.render('indexx')
        }
        else {
            return res.render('otp_verify')
        }
    } catch (error) {
        res.status(400).json({ msgee: error.message })
    }
}

module.exports = { signUp, signIn, forgotPassword, otp_verify, forgotPass }