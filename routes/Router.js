const express = require('express')
const {signUp,signIn,forgotPassword,otp_verify,forgotPass} = require('../controllers/Controller.js')
const router = express.Router()


router.route('/signUp').post(signUp)
router.route('/signIn').post(signIn)
router.route('/forgotPassword').post(forgotPassword)
router.route('/forgotPass').get(forgotPass)
router.route('/otp_verify/:email').post(otp_verify)

module.exports = router