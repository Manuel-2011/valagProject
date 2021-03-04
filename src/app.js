const express = require('express')
const path = require('path')
const hbs = require('hbs')
const cors = require('cors');
const {generateMessage} = require('./utils/messages')
const { addUser, removeUser, getUser } = require('./utils/users')

const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const port = process.env.PORT || 3000 

app.use(cors());

const publicDirectory = path.join( __dirname, '../public' )
app.use(express.static(publicDirectory))

app.set('view engine', 'hbs')
const viewsPath = path.join(__dirname, '../templates/views')
app.set('views', viewsPath)
const partialsPath = path.join(__dirname, '../templates/partials')
hbs.registerPartials(partialsPath)

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/contactenos', (req, res) => {
    res.render('contactenos')
})

app.get('/nosotros', (req, res) => {
    res.render('nosotros')
})

app.get('/supportchat', (req, res) => {
    res.render('supportChat')
})

// events

io.on('connection', (socket) => {

    // When a new client enters the chat
    socket.on('join', (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options })

        if (error) {
            return callback(error)
        }

        // Create a private room for the user and support if it is a client
        // if it is a support agent join him to the support channel
        if (user.rol === 'client') {
            socket.join(user.username)
            // Emit the join event for support to know
            io.to('support').emit('clientJoin', { socketId: socket.id, user})
        } else {
            socket.join('support')
        }


        // Welcome the user
        socket.emit('newMessage', generateMessage('Valag', 'Bienvenido a Valag, ¿en qué te podemos ayudar?'))
    })

    // Enviar mensaje
    socket.on('sendMessage', ({ to, message }) => {
    const from = getUser(socket.id)
    
    let client
    if (to.rol === 'cliente') {
        client = getUser(to.socketId)
    } else {
        client = from
    }



    // Enviar mensaje a cliente
    io.to(client.username).emit('newMessage', generateMessage(from.username, message))
    // Enviar mensaje a soporte
    io.to('support').emit('newMessage', generateMessage(from.username, message))


    });
  });



http.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})