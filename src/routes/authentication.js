const express = require('express')
const router = express.Router()
const passport = require('passport')

//--------------------------------------------- Signin (formulario)
router.get('/signin', (req, res) => {
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
router.get('/signup', (req, res)=> {
    res.render('auth/signup')
})

//---------------------- Es otra forma de especificar la autenticacion de la ruta, funciona como la función de arriba.
router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
  }));


router.get('/profile', (req, res)=> {
    res.render('profile')
})

router.get('/logout', (req, res)=> {
    req.logOut()
    res.redirect('/signin')
})

module.exports = router