const express = require('express')
const router = express.Router()

//import controllers
const { signup, signin } = require('../controller/auth')

//import validators
const { userSignupValidator, userSigninValidator } = require('../validators/auth')
const { runValidation } = require('../validators/index')

router.post('/signup', userSignupValidator, runValidation, signup)

router.post('/signin', userSigninValidator, runValidation, signin)

module.exports = router