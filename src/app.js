require('./db/mongoose')
const express = require('express')
const path = require('path')
const hbs = require('hbs')
const cors = require('cors');
const cookieParser = require('cookie-parser')
const {generateMessage} = require('./utils/messages')
const { addUser, removeUser, getUser, getUserByName, getClients, getAgents } = require('./utils/users');
const userRouter = require('./routers/user')
const auth = require('./middleware/auth')

const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const port = process.env.PORT || 3000 

app.use(cors());
app.use(cookieParser())

const publicDirectory = path.join( __dirname, '../public' )
app.use(express.static(publicDirectory))

app.use(express.json())
app.use('/users', userRouter)

app.set('view engine', 'hbs')
const viewsPath = path.join(__dirname, '../templates/views')
app.set('views', viewsPath)
const partialsPath = path.join(__dirname, '../templates/partials')
hbs.registerPartials(partialsPath)
hbs.registerHelper('isAdmin', function (value) {
    return value === 'admin';
});

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/contactenos', (req, res) => {
    res.render('contactenos')
})

app.get('/nosotros', (req, res) => {
    res.render('nosotros')
})

app.get('/supportchat', auth, (req, res) => {
    res.render('supportChat', { agentUser: req.user})
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
            if (getAgents(user.supportType).length === 0) {
                return callback('noSupportAgents')
            }


            // Emit the join event for support to know
            // Emit the event to the corresponding support agents
            io.to(user.supportType).emit('clientJoin', user)

            // Welcome the user
            socket.emit('newMessage', generateMessage('Valag', 'Bienvenido a Valag, ¿en qué te podemos ayudar?'))
        } else {
            socket.join(user.supportType)
            // Enviar clientes activos al soporte que se unió
            socket.emit('supportJoin', getClients(user.supportType))
            // Enviar evento para clientes que estaban conectados pero no habían agentes de soporte disponibles
            io.emit('agentAvailable', user.supportType)
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
                io.to(client.supportType).emit('newMessage', generateMessage(from.username, message, client.username))
            } else {
                client = from
                 // Enviar mensaje a cliente
                 io.to(client.username).emit('newMessage', generateMessage(from.username, message))
                 // Enviar mensaje a soporte
                 io.to(client.supportType).emit('newMessage', generateMessage(from.username, message))
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
                io.to(user.supportType).emit('clientLeft', user)
            }
        }
    })
  });



http.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})