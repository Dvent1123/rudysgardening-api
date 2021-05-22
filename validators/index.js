const { validationResult } = require('express-validator')

exports.runValidation = (req, res, next) => {
    const errors = validationResult(req)
    //if there are error then send status 422 along with errors
    if(!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg
        })
    }
    //if there are no errors then continue execution
    next()
}