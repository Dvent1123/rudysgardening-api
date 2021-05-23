const { check } = require('express-validator')

exports.paymentValidator = [
    check('email')
        .isEmail()
        .withMessage('Must be a valid email address'),
    check('service')
        .trim()
        .not()
        .isEmpty()
        .withMessage('The service needs to be filled out'),
    check('amount')
        .toFloat()
        .not()
        .isEmpty()
        .withMessage('The amount needs to be filled out'),
    check('total')
        .toFloat()
        .not()
        .isEmpty()
        .withMessage('The total needs to be filled out'),
    check('paid_status')
        .toBoolean()
        .not()
        .isEmpty()
        .withMessage('The payment must be paid or unpaid'),
    check('due')
        .toDate()
        .not()
        .isEmpty()
        .withMessage('Must be a valid due date')
]