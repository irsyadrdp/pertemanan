//include modeuls
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const mainRoute = require('./routes/index')

//body parser
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());
app.use(cookieParser())

//static files & pug
app.use('/public', express.static('public'))
app.set('view engine','pug')

//button.pug
app.use((req, res, next) => {
    res.locals.url = req.originalUrl
    next()
})
app.use(mainRoute)


//error handler
app.use((req, res, next) => {
    let notFound = new Error("URL Not found")
    notFound.status = 404
    next(notFound)
})

//error
app.use((err, req, res, next) => {
    res.locals.error = err
    res.render('error')
})


//start server
let port = 3333
app.listen(port, () => {
	console.log(`Client started on http://localhost:${port}`);
})