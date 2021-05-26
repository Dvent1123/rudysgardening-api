const { newUser, paymentFromUser  } = require('../models/user')


exports.create = (req, res) => {
    const { email, service, amount, total, paid_Status, due } = req.body
    //find user if error send error if does not exist send error
    newUser.findOne({ email: email}, (err, user) => {
        if(err || !user) {
            return res.status(400).json({
                error: 'User not found'
            })
        }
        //create payment
        let payment = paymentFromUser({user: email, service, amount, total, paid_Status, due})
        user.payments.push(payment)
    
        user.save((err, success) => {
            if(err){
                return res.status(400).json({
                    error: err
                })
            }
        
            res.json({
                message: 'Payment Created!'
            })
        })
    })
}

//all payments for user
exports.allPaymentsForUser = (req, res) => {
    const email = req.params.email
    //find user if error send error if does not exist send error
    newUser.findOne({ email: email}, (err, user) => {
        if(err || !user) {
            return res.status(400).json({
                error: 'User not found'
            })
        }

        //find the payments that a user has not paid paid_status=false
        //create payment
        let allUnpaidPayments = user.payments.filter(payment => {
            return payment.paid_Status !== true
        })

        res.json({
            unpaid: allUnpaidPayments
        })
    })
}

exports.allPaymentsForAdmin = (req, res) => {
    newUser.find({}, (err, users) => {
        //if there is an error getting users
        if(err) {
            return res.status(400).json({
                error: 'There was some error'
            })
        }
        //if there are no users there are no unpaid payments
        if(!users){
            return res.json({unpaid: []})
        }

        let unpaidPayments = []
        users.forEach( user => {
            if(user.payments !== []){
                user.payments.forEach(payment => {
                    if(payment.paid_Status !== true){
                        unpaidPayments.push(payment)
                    }
                })
            }
        })

        console.log(unpaidPayments)

        res.json({
            unpaid: unpaidPayments
        })
    })
}

//updates the bill from paid = false to paid = true
exports.updateBillingStatus = (req, res) => {
    const { id, email } = req.body
        newUser.findOne({email: email, "payments._id": id}, (err, user) => {
            if(err || !user) {
                return res.status(400).json({
                    error: 'Payment not found'
                })
            }
            user.payments[0].paid_Status = true

            user.save((err, success) => {
                if(err){
                    return res.status(400).json({
                        error: err
                    })
                }
            
                res.json({
                    message: 'Bill Status Updated!'
                })
            })

        })
}