const express = require('express')
const router = express.Router()

const { requireSignin, adminMiddleware } = require('../controller/auth')
const { create, allPaymentsForUser, allPaymentsForAdmin, updateBillingStatus } = require('../controller/payment')


const { paymentValidator } = require('../validators/payment')
const { runValidation } = require('../validators/index')

router.get('/payment/admin',requireSignin, adminMiddleware, allPaymentsForAdmin)
router.get('/payment/user/:email',requireSignin, allPaymentsForUser)
router.post('/payment', requireSignin, adminMiddleware, create)
router.post('/payment',requireSignin, adminMiddleware, paymentValidator, runValidation, create)
router.post('/payment/success', updateBillingStatus)

module.exports = router