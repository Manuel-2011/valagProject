const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try {
        let token = req.header('Authorization')
        if (!token && req.cookies.token) {
            token = req.cookies.token
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token})

        if (!user) {
            throw new Error()
        }

        req.token = token
        req.user = user
        next()
    } catch(error) {
        res.render('login')
    }
}

module.exports = auth