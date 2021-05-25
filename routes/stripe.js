const express = require('express')
const router = express.Router()

const { config, checkoutSession, createCheckoutSession, webhook } = require('../controller/stripe')


router.get('/stripe',config)
router.get('/stripe/checkout-session', checkoutSession)
router.post('/stripe/create-checkout-session', createCheckoutSession)
router.post('/stripe/webhook', webhook)

module.exports = router