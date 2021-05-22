const mongoose = require('mongoose')
const crypto = require('crypto')

const PaymentSchema = new mongoose.Schema({
    service: String,
    amount: Number,
    total: Number,
    paid_Status: Boolean,
    due: Date //Mongoose will cast value to native JS or in form 2002-12-09
}, {timestamps: true})

const paymentFromUser = mongoose.model('Payment', PaymentSchema)

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        max: 32
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        lowercase: true
    },
    payments: [PaymentSchema],
    hashed_password: {
        type: String,
        required: true,
    },
    salt: String,
    role: {
        type: String,
        default: 'subscriber'
    },
    resetPasswordLink: {
        data: String,
        default: ''
    }
}, {timestamps: true})

userSchema.virtual('password')
.set(function(password) {
    this._password = password
    this.salt = this.makeSalt()
    this.hashed_password = this.encryptPassword(password)
})
.get(function(){
    return this._password
})

userSchema.methods = {
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password
    },
    encryptPassword: function(password) {
        if(!password) return ''
        try {
            return crypto.createHmac('sha1', this.salt)
                .update(password)
                .digest('hex')
        } catch(err) {
            return ''
        }
    },
    makeSalt: function() {
        return Math.round(new Date().valueOf() * Math.random()) + ''
    }
}

const newUser = mongoose.model('User', userSchema)

module.exports = {
    newUser: newUser,
    paymentFromUser: paymentFromUser
}