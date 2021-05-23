const { newUser } = require('../models/user')

exports.all = (req, res) => {
    newUser.find({}).exec((err, user) => {
        if(err) {
            return res.status(400).json({
                error: 'There was an error'
            })
        }
        if(!user) {
            //if there are no users return an empty array
            res.json([])
        }
        let emailsArray = user.filter(checkAdmin => checkAdmin.role !== 'admin').map(individualUser => individualUser.email)
        res.json(emailsArray)
    })
}

exports.read = (req, res) => {
    const userId = req.params.id
    newUser.findById(userId).exec((err, user) => {
        if(err || !user) {
            return res.status(400).json({
                error: 'User not found'
            })
        }
        user.hashed_password = undefined
        user.salt = undefined
        res.json(user)
    })
}

exports.update = (req, res) => {
    const { name, password } = req.body
    console.log(req.user)

    newUser.findOne({ _id: req.user._id}, (err, user) => {
        if(err || !user) {
            return res.status(400).json({
                error: 'User not found'
            })
        }
        if(!name) {
            return res.status(400).json({
                error: 'Name is required'
            })
        } else {
            user.name = name
        }
        if(password) {
            if(password.length < 6) {
                return res.status(400).json({
                    error: 'Password should be minimum 6 characters long'
                })
            } else {
                user.password = password
            }
        }

        user.save((err, updatedUser) => {
            if(err) {
                console.log('User update error', err)
                return res.status(400).json({
                    error: 'User update failed'
                })
            }
            updatedUser.hashed_password = undefined
            updatedUser.salt = undefined
            res.json(updatedUser)
        })
    })
}