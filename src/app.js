const express = require('express')
const path = require('path')
const hbs = require('hbs')
const cors = require('cors');
const {generateMessage} = require('./utils/messages')
const { addUser, removeUser, getUser, getUserByName, getClients, getAgents } = require('./utils/users');
const { get } = require('http');

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

            // Revisar si no hay agentes de soporte disponibles
            if (getAgents().length === 0) {
                return callback('noSupportAgents')
            }


            // Emit the join event for support to know
            io.to('support').emit('clientJoin', user)

            // Welcome the user
            socket.emit('newMessage', generateMessage('Valag', 'Bienvenido a Valag, ¿en qué te podemos ayudar?'))
        } else {
            socket.join('support')
            // Enviar clientes activos al soporte que se unió
            socket.emit('supportJoin', getClients())
            // Enviar evento para clientes que estaban conectados pero no habían agentes de soporte disponibles
            io.emit('agentAvailable')
        }

        callback()
    })

    // Enviar mensaje
    socket.on('sendMessage', ({ to, message }, callback) => {
        const from = getUser(socket.id)
        
        // Definir quien es el cliente para saber el nombre del canal privado cliente-soporte
        let client
        try {
            if (to.rol === 'client') {
                client =  getUserByName(to.username)
                 // Enviar mensaje a cliente
                io.to(client.username).emit('newMessage', generateMessage(from.username, message))
                // Enviar mensaje a soporte
                io.to('support').emit('newMessage', generateMessage(from.username, message, client.username))
            } else {
                client = from
                 // Enviar mensaje a cliente
                 io.to(client.username).emit('newMessage', generateMessage(from.username, message))
                 // Enviar mensaje a soporte
                 io.to('support').emit('newMessage', generateMessage(from.username, message))
            }

            callback()
        } catch (error) {
            callback(error)
        }
       
    });

    // Usuario se desconecta
    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
    
        if (user) {
            if (user.rol === 'client') {
                io.to('support').emit('clientLeft', user)
            }
        }
    })
  });



http.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})