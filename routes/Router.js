const express = require('express')
const {signUp,signIn,forgotPassword,otp_verify} = require('../controllers/Controller.js')
const router = express.Router()


router.route('/signUp').post(signUp)
router.route('/signIn').post(signIn)
router.route('/forgotPassword').post(forgotPassword)
router.route('/otp_verify').post(otp_verify)

module.exports = router