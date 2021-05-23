const { newUser } = require('../models/user')
const jwt = require('jsonwebtoken')
const expressJWT = require('express-jwt')

exports.signup = (req, res) => {
    console.log('REQ BODY ON SIGNUP', req.body)
    const { name, email, password } = req.body

    newUser.findOne({ email: email }).exec((err, user) => {
        if(user) {
            return res.status(400).json({
                error: 'Email is taken'
            })
        }
        if(err) {
            return res.status(400).json({
                error: 'There was a network error'
            })
        }
    })

    user.save((err, success) => {
        if(err){
            return res.status(400).json({
                error: err
            })
        }
    
        res.json({
            message: 'Signup success! Please sign in'
        })
    })
}


exports.signin = (req, res) => {
    const { email, password } = req.body
    console.log('this is the email and password', email, password)

    newUser.findOne({ email}).exec((err, user) => {
        if(err || !user ){
            return res.status(400).json({
                error: 'User with that email does not exist. Please sign up'
            })
        }
        if(!user.authenticate(password)) {
            return res.status(400).json({
                error: 'Email and password do not match'
            })            
        }

        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'})
        const {_id, name, email, role} = user

        return res.json({
            token,
            user: {_id, name, email, role}
        })
    })
}


//requires signin to have access to user CRUD operations
exports.requireSignin = expressJWT({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256']
})

//checks to ensure that a user has an admin role
exports.adminMiddleware = (req, res, next) => {
    newUser.findById({ _id: req.user._id }).exec((err, user) => {
        if(err || !user) {
            return res.status(400).json({
                error: 'User not found'
            })
        }

        if(user.role !== 'admin') {
            return res.status(400).json({
                error: 'Admin resource. Access denied'
            })
        }

        req.profile = user
        next()
    })
}