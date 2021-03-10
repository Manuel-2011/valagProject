const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')

// register user
router.post('/', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()

        res.status(201).send({ user })
    } catch (error) {
        res.status(400).send(error)
    }
})

// login
router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.correo, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })

    } catch (error) {
        res.status(400).send({ error: 'Credenciales no son validos!'})
    }
})

// logout
router.post('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch(error) {
        res.status(500).send()
    }
})


module.exports = router