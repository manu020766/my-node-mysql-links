const express = require('express')
const router = express.Router()
const passport = require('passport')

router.get('/signup', (req, res)=> {
    res.render('auth/signup')
})

//---------------------- Es otra forma de especificar la autenticacion de la ruta, funciona como la función de abajo.
// router.post('/signup', (req, res)=> {
//     passport.authenticate('local.signup', {
//         successRedirect: '/profile',
//         failureRedirect: '/signup',
//         failureFlash: true
//     })

//     res.send('received')
// })

//---------------------- Es otra forma de especificar la autenticacion de la ruta, funciona como la función de arriba.
router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
  }));


router.get('/profile', (req, res)=> {
    res.send('profile')
})

module.exports = router