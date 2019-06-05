const express = require('express')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const path = require('path')

// inicializaciones
const app = express()

// settings
app.set('port', process.env.PORT || 4000)

//------ configurar las rutas necesarias para utilizar handlebars
app.set('views', path.join(__dirname, 'views'))

app.engine('hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}))
app.set('view engine', '.hbs')
//----------------------------------------------------------------

// midlewares
app.use(morgan('dev'))
app.use(express.urlencoded({extended: false}))  // acepta datos sencillos de un formulario
app.use(express.json())                         // aceptar llamadas desde un cliente (API)


// Global variables
app.use((req, res, next) => {                   // Intercepta todas las llamadas al servidor
    next()                                      // sigue su curso
})

// Rutas
app.use(require('./routes'))                    // Generales
app.use(require('./routes/authentication'))     // Authentication
app.use('/links', require('./routes/links'))     // links (añade prefijo links)


// Public (archivos publicos)
app.use(express.static(__dirname + '/public'));

// Starting the server
app.listen(app.get('port'), () => console.log(`server listening on port ${app.get('port')}`))
