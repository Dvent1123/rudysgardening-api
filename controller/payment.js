const { newUser, paymentFromUser  } = require('../models/user')


exports.create = (req, res) => {
    const { email, service, amount, total, paid_status, due } = req.body
    //find user if error send error if does not exist send error
    newUser.findOne({ email: email}, (err, user) => {
        if(err || !user) {
            return res.status(400).json({
                error: 'User not found'
            })
        }
        //create payment
        let payment = paymentFromUser({service, amount, total, paid_status, due})
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