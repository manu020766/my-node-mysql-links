const express = require('express')
const router = express.Router()
const passport = require('passport')

const { isLoggedIn, isNotLoggedIn } = require('../lib/auth')

//--------------------------------------------- Signin (formulario)
router.get('/signin', isNotLoggedIn, (req, res) => {
    res.render('auth/signin')
})

//---------------------- Es otra forma de especificar la autenticacion de la ruta, funciona como la función de abajo.
router.post('/signin', (req, res, next)=> {
    passport.authenticate('local.signin', {
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res, next)
})


//--------------------------------------------- Signup (formulario)
router.get('/signup', isNotLoggedIn, (req, res)=> {
    res.render('auth/signup')
})

//---------------------- Es otra forma de especificar la autenticacion de la ruta, funciona como la función de arriba.
router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
  }));


router.get('/profile', isLoggedIn, (req, res)=> {   // Con isLoggedIn protejo el acceso a la ruta
    res.render('profile')
})

router.get('/logout', (req, res)=> {
    req.logOut()
    res.redirect('/signin')
})

module.exports = router