const express = require('express')
const router = express.Router()

const { requireSignin, adminMiddleware } = require('../controller/auth')
const { create } = require('../controller/payment')


const { paymentValidator } = require('../validators/payment')
const { runValidation } = require('../validators/index')

// router.post('/payment', requireSignin, adminMiddleware, create)
router.post('/payment',requireSignin, adminMiddleware, paymentValidator, runValidation, create)

module.exports = router