const express = require('express')
const path = require('path')
const hbs = require('hbs')

const app = express()
const port = process.env.PORT || 3000 

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


app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})