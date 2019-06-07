const express = require('express')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const path = require('path')

const flash = require('connect-flash')
const session = require('express-session')
const MySQLStore =  require('express-mysql-session')
const { database } = require('./keys')

const passport = require('passport')


// inicializaciones
const app = express()
require('./lib/passport')

// settings
app.set('port', process.env.PORT || 4000)

//------ configurar las rutas necesarias para utilizar handlebars
app.set('views', path.join(__dirname, 'views'))

console.log(`views: ${app.get('views')}`)

app.engine('hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}))
app.set('view engine', '.hbs')

console.log(`LayoutDir: ${path.join(app.get('views'), 'layouts')}`)
console.log(`partialsDir: ${path.join(app.get('views'), 'partials')}`)
//----------------------------------------------------------------

// midlewares
app.use(session({   
    secret: 'tutruru',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
    }))                                         // es obligatorio definir la sesion antes de usar flash
app.use(flash())                                // enviar mensajes entre vistas

app.use(morgan('dev'))
app.use(express.urlencoded({extended: false}))  // acepta datos sencillos de un formulario
app.use(express.json())                         // aceptar llamadas desde un cliente (API)

app.use(passport.initialize())  // Inicia passport
app.use(passport.session())     // Crea una session para passport


// Global variables
app.use((req, res, next) => {                   // Intercepta todas las llamadas al servidor
    app.locals.success = req.flash('success')   // Defino la variable global success. Se puede recuperar desde cualquier vista
    app.locals.message = req.flash('message')   // Defino la variable global success. Se puede recuperar desde cualquier vista
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
