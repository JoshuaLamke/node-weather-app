const express = require('express')
const path = require('path')
const hbs = require('hbs')
const geoCode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// set up handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//set up static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index',{
        title: 'Weather',
        name: 'Joshua Lamke'
    })
})
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Joshua Lamke'
    })
})
app.get('/help', (req, res) => {
    res.render('help',{
        title: 'Help',
        helpMessage: 'How To Search: Type an address into the input field in the home page.',
        name: 'Joshua Lamke'
    })
})
app.get('/products', (req, res) => {
    if(!req.query.search){
        return res.send({
            error: 'Must provide a search term'
        })
    }
    res.send({
        products: []
    })
})
app.get('/weather', (req, res) => {
    if(!req.query.address){
        return res.send({
            error: 'Must provide an address'
        })
    }
    geoCode(req.query.address,(error, {longitude, latitude, location} = {}) => {
        if(error){
            return res.send({
                error
            })
        }
        forecast(latitude, longitude, (error, forecast) => {
            if(error){
                return res.send({
                    error
                })
            }
            res.send({
                forecast,
                location,
                address: req.query.address
            })
        })
        
    })
})
app.get('/help/*', (req, res) => {
    res.render('404-page',{
        errorMessage: 'Help article not found',
        name: 'Joshua Lamke',
        title: 'Page Not Found'
    })
})
app.get('*', (req, res) => {
    res.render('404-page',{
        errorMessage: 'This page does not exist',
        name: 'Joshua Lamke',
        title: 'Page Not Found'
    })
})
app.listen(3000, () => {
    console.log('Server is up on port 3000')
})