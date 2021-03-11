const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')

// register user
router.post('/', auth, async (req, res) => {
    if (req.user.rol !== 'admin') {
        return res.status(400).send('El usuario debe ser administrador!')
    }

    req.body.rol = 'agente'
    const user = new User(req.body)
    try {
        await user.save()

        res.status(201).send({ user })
    } catch (error) {
        res.status(400).send(error)
    }
})

//delete user
router.delete('/:id', auth, async (req, res) => {
    if (req.user.rol !== 'admin') {
        return res.status(400).send({error: 'El usuario debe ser administrador!'})
    }

    try {
        const info = await User.deleteOne({ _id: req.params.id })
        res.send(info)
    } catch (error) {
        res.status(500).send(error)
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

// logout of all sessions
router.post('/logoutall/:id', auth, async(req, res) => {
    if (req.user.rol !== 'admin') {
        return res.status(400).send({error: 'El usuario debe ser administrador!'})
    }

    try {
        const user = await User.findById(req.params.id)
        user.tokens = []
        await user.save()
        res.send(user)
    } catch (error) {
        res.status(500).send(error)
    }
})


// admin site
router.get('/admin', auth, async (req, res) => {
    if (req.user.rol !== 'admin') {
        return res.render('login')
    }

    // fetch all users
    const users = await User.find({})

    res.render('admin', { users })
})

// get user info
router.get('/:id', auth, async (req, res) => {
    if (req.user.rol !== 'admin') {
        return res.status(400)
    }

    try {
        const user = await User.findById(req.params.id)

        if (!user) {
            res.status(400)
        }

        res.send({ user })
    } catch (error) {
        res.status(400)
    } 
})

// update user info
router.put('/:id', auth, async (req, res) => {
    if (req.user.rol !== 'admin') {
        return res.status(400)
    }

    // only update allowed fields
    const allowedUpdates = ['nombre', 'correo', 'password']

    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            res.status(400)
        }

        allowedUpdates.forEach(field => {if(req.body[field]) {user[field] = req.body[field]}})

        await user.save()

        res.send({ user })
    } catch (error) {
        res.status(400)
    }
})


module.exports = router