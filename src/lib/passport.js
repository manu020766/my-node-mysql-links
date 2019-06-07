const passport = require('passport')
const localStrategy = require('passport-local').Strategy

const pool = require('../database')
const helpers = require('../lib/helpers')

//-------------------------------------------------------------------
// --------------- Proceso de signin (Entrar con usuario usuario) ---
//-------------------------------------------------------------------
passport.use('local.signin', new localStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {

    const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username])
    if (rows.length > 0) {
        const user = rows[0]
        const validPassword = await helpers.matchPassword(password, user.password)
        if (validPassword) {
            done(null, user, req.flash('success','Welcome ' + user.username))
        } else {
            done(null, false, req.flash('message','Incorrect password'))
        }
    } else {
        done(null, false, req.flash('message','Nombre de usuario no existe'))
    }

}))

//-------------------------------------------------------------------
// --------------- Proceso de signup (Registrar usuario) ------------
//-------------------------------------------------------------------
passport.use('local.signup', new localStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const { fullname } = req.body
    const newUser = {
        username,
        password,
        fullname
    }
    newUser.password = await helpers.encryptPassword(password)  // le añado el password encryptado al objecto newUser, sustituyendo al password sin encriptar

    const result = await pool.query('INSERT INTO users SET ?',[newUser])
    
    newUser.id = result.insertId    // Le añado el id, que se crea al insertar el usuario en la base de datos, al objecto newUser
    return done(null, newUser)      // devolver que no hay error, devuelve el user para que lo almacene en una sessison

}))

passport.serializeUser((user, done) => {              // Guardo el id del usuario  en la session
    done(null, user.id)                               
})
passport.deserializeUser( async (id, done) => {                             // Recupero con el id del usuario todos sus datos
    const rows = await pool.query('SELECT * FROM users WHERE id = ?',[id])
    done(null, rows[0])
})
